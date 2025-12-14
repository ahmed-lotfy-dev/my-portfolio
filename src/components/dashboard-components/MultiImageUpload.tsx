"use client";

import { ChangeEvent, useRef, useState } from "react";
import { Input } from "@/src/components/ui/input";
import { notify } from "@/src/lib/utils/toast";
import { Button } from "@/src/components/ui/button";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Loader2, Trash2, Star, Plus, Check } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { authClient } from "@/src/lib/auth-client";

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

export function MultiImageUpload({
  images,
  setImages,
  primaryImage,
  setPrimaryImage,
  imageType,
  itemSlug,
  itemTitle,
}: MultiImageUploadProps) {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const t = useTranslations("projects");

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const files = Array.from(e.target.files);

    // Validate all files
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        notify(`Skipped ${file.name}: Not an image`, false);
        continue;
      }
      if (file.size > 10 * 1024 * 1024) {
        notify(`Skipped ${file.name}: Too large (>10MB)`, false);
        continue;
      }

      await uploadFile(file);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadFile = async (file: File) => {
    setIsOptimizing(true);
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
        notify(`Uploaded ${file.name}`, true);
        const newUrl = data.coverImage;

        // Add to images list
        const newImages = [...images, newUrl];
        setImages(newImages);

        // If it's the first image, make it primary automatically
        if (newImages.length === 1 && !primaryImage) {
          setPrimaryImage(newUrl);
        }
      } else {
        notify(data.message, false);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      notify(`Failed to upload ${file.name}`, false);
    } finally {
      setIsOptimizing(false);
    }
  };

  const { data: session } = authClient.useSession();
  const isAdmin = session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  const handleDelete = (urlToDelete: string) => {
    if (!isAdmin) {
      notify("You have no privileges doing this", false);
      return;
    }

    const newImages = images.filter(url => url !== urlToDelete);
    setImages(newImages);

    // If we deleted the primary image, pick the first available one (if any)
    if (primaryImage === urlToDelete) {
      setPrimaryImage(newImages.length > 0 ? newImages[0] : "");
    }
  };

  return (
    <div className="space-y-4">
      {/* Grid of uploaded images */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          {images.map((url, index) => {
            const isPrimary = url === primaryImage;
            return (
              <div
                key={`${url}-${index}`}
                className={cn(
                  "relative aspect-video rounded-lg overflow-hidden border-2 group transition-all",
                  isPrimary ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-border/80"
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
                  {!isPrimary && (
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
                        onClick={(e) => {
                          e.stopPropagation();
                          // Don't preventDefault here, or Trigger won't work
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This check to prevent accidental deletions.
                          The image will be removed from this project.
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
                          Delete
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
        multiple // Allow selecting multiple files
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

type MultiImageUploadProps = {
  images: string[];
  setImages: (images: string[]) => void;
  primaryImage: string;
  setPrimaryImage: (url: string) => void;
  imageType: string;
  itemSlug: string;
  itemTitle?: string;
};
