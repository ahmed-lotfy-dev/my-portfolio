"use client";

import { ChangeEvent, useRef, useState, Dispatch, SetStateAction } from "react";
import { Input } from "@/src/components/ui/input";
import { notify } from "@/src/lib/utils/toast";
import { Button } from "@/src/components/ui/button";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Loader2, Trash2, Star, Plus } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { deleteImageFromProject } from "@/src/app/actions/deleteImageFromProject";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/src/components/ui/alert-dialog";

type MultiImageUploadProps = {
  images: string[];
  setImages: Dispatch<SetStateAction<string[]>>;
  primaryImage: string;
  setPrimaryImage: (url: string) => void;
  imageType: string;
  itemSlug: string;
  itemTitle?: string;
  user?: any; // Pass user from server
};

export function MultiImageUpload({
  images,
  setImages,
  primaryImage,
  setPrimaryImage,
  imageType,
  itemSlug,
  itemTitle,
  user,
}: MultiImageUploadProps) {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const t = useTranslations("projects");

  const isAdmin = user?.role === "ADMIN";

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const files = Array.from(e.target.files);
    setIsOptimizing(true);

    try {
      // Validate all files first
      const validFiles: File[] = [];
      for (const file of files) {
        if (!file.type.startsWith("image/")) {
          notify(`Skipped ${file.name}: Not an image`, false);
          continue;
        }
        if (file.size > 10 * 1024 * 1024) {
          notify(`Skipped ${file.name}: Too large (>10MB)`, false);
          continue;
        }
        validFiles.push(file);
      }

      if (validFiles.length === 0) {
        setIsOptimizing(false);
        return;
      }

      // Upload all valid files in parallel
      const uploadPromises = validFiles.map(file => uploadFile(file));
      const results = await Promise.all(uploadPromises);

      // Filter out nulls (failed uploads)
      const successfulUrls = results.filter((url): url is string => url !== null);

      if (successfulUrls.length > 0) {
        // Use functional state update - ONLY use prevImages, never the stale closure
        setImages((prevImages) => {
          const updatedImages = [...prevImages, ...successfulUrls];

          // If it's the first image(s), make the first one primary automatically
          if (prevImages.length === 0 && !primaryImage) {
            setPrimaryImage(successfulUrls[0]);
          }
          return updatedImages;
        });

        notify(`Uploaded ${successfulUrls.length} image(s) successfully`, true);
      }
    } catch (error) {
      console.error("Error processing uploads:", error);
      notify("An error occurred during upload", false);
    } finally {
      setIsOptimizing(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("image-type", imageType);

      if (itemSlug) {
        formData.append("item-slug", itemSlug);
      }

      if (itemTitle) {
        formData.append("item-title", itemTitle);
      }

      const response = await fetch("/api/upload/optimize", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        return data.coverImage;
      } else {
        notify(`${file.name}: ${data.message}`, false);
        return null;
      }
    } catch (error) {
      console.error(`Error uploading ${file.name}:`, error);
      notify(`Failed to upload ${file.name}`, false);
      return null;
    }
  };


  const handleDelete = async (urlToDelete: string) => {
    if (!isAdmin) {
      notify("You have no privileges doing this", false);
      return;
    }

    setIsDeleting(urlToDelete);

    try {
      // Delete from R2 storage
      const result = await deleteImageFromProject(urlToDelete);

      if (!result.success) {
        notify(result.message, false);
        setIsDeleting(null);
        return;
      }

      // Update state - remove from images array
      setImages((prevImages) => {
        const newImages = prevImages.filter(url => url !== urlToDelete);

        // If we deleted the primary image, pick the first available one (if any)
        if (primaryImage === urlToDelete) {
          setPrimaryImage(newImages.length > 0 ? newImages[0] : "");
        }
        return newImages;
      });

      const fileName = urlToDelete.split('/').pop() || "Image";
      notify(`Deleted ${fileName} successfully`, true);
    } catch (error) {
      console.error("Error deleting image:", error);
      notify("Failed to delete image", false);
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Grid of uploaded images */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-6">
          {images.map((url, index) => {
            const isPrimary = url === primaryImage;
            const isBeingDeleted = isDeleting === url;

            return (
              <div
                key={`${url}-${index}`}
                className={cn(
                  "group relative aspect-video w-full rounded-xl overflow-hidden border-2 bg-background shadow-sm transition-all hover:shadow-md",
                  isPrimary ? "border-primary ring-2 ring-primary/20" : "border-border/50 hover:border-border",
                  isBeingDeleted && "opacity-50"
                )}
              >
                <Image
                  src={url}
                  alt={`Project image ${index + 1}`}
                  fill
                  className="object-cover"
                />

                {/* Actions Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {/* Make Primary Button */}
                  {!isPrimary && !isBeingDeleted && (
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 text-xs gap-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setPrimaryImage(url);
                      }}
                      type="button"
                    >
                      <Star className="w-3 h-3" /> Set Cover
                    </Button>
                  )}

                  {/* Delete Button with AlertDialog */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="icon"
                        variant="destructive"
                        className="h-8 w-8 z-20"
                        disabled={isBeingDeleted}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        {isBeingDeleted ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete the image from storage.
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(url);
                          }}
                          className="bg-destructive hover:bg-destructive/90"
                        >
                          Delete Permanently
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                {/* Primary Badge */}
                {isPrimary && (
                  <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" /> Cover
                  </div>
                )}

                {/* Deleting Overlay */}
                {isBeingDeleted && (
                  <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                    <div className="text-white text-sm flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Deleting...
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Button */}
      <div className="flex gap-2">
        <Button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isOptimizing}
          variant="outline"
          className="w-full h-24 border-dashed border-2 flex flex-col gap-2 hover:bg-secondary/50"
        >
          {isOptimizing ? (
            <>
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <Plus className="h-6 w-6" />
              <span>{images.length === 0 ? "Upload Images" : "Add More Images"}</span>
            </>
          )}
        </Button>
      </div>

      <Input
        type="file"
        accept="image/*"
        multiple
        name="images-upload"
        onChange={handleFileSelect}
        ref={fileInputRef}
        style={{ display: "none" }}
      />

      <p className="text-sm text-muted-foreground text-center">
        Supported: JPG, PNG, WEBP (Max 10MB). First image or selected 'Cover' will be used as the preview card.
      </p>
    </div>
  );
}
