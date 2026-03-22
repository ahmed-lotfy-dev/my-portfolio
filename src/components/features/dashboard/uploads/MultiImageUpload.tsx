
"use client";

import { ChangeEvent, useRef, useState } from "react";
import { notify } from "@/src/lib/utils/toast";
import { deleteImageFromProject } from "@/src/app/actions/media/mutations";
import { deleteImagesFromProjectAction } from "@/src/app/actions/projects/mutations";

// Sub-components
import { GalleryHeader } from "./multi-upload/GalleryHeader";
import { ImageGrid } from "./multi-upload/ImageGrid";
import { UploadButton } from "./multi-upload/UploadButton";

// Types
import { MultiImageUploadProps } from "@/src/lib/types/project";

export function MultiImageUpload({
  images,
  setImages,
  primaryImage,
  setPrimaryImage,
  imageType,
  itemSlug,
  itemTitle,
  projectId,
  user,
}: MultiImageUploadProps) {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const isAdmin = user?.role === "ADMIN";

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const files = Array.from(e.target.files);
    setIsOptimizing(true);

    try {
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

      const uploadPromises = validFiles.map(file => uploadFile(file));
      const results = await Promise.all(uploadPromises);
      const successfulUrls = results.filter((url): url is string => url !== null);

      if (successfulUrls.length > 0) {
        setImages((prevImages) => {
          const updatedImages = [...prevImages, ...successfulUrls];
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
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("image-type", imageType);
      if (itemSlug) formData.append("item-slug", itemSlug);
      if (itemTitle) formData.append("item-title", itemTitle);

      const response = await fetch("/api/upload/optimize", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) return data.coverImage;
      notify(`${file.name}: ${data.message}`, false);
      return null;
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
      if (projectId) {
        const result = await deleteImagesFromProjectAction(projectId, [urlToDelete]);
        if (!result.success) {
          notify(result.message, false);
          return;
        }
        if ('updatedImages' in result && result.updatedImages) setImages(result.updatedImages);
        if ('updatedCover' in result && result.updatedCover !== undefined) setPrimaryImage(result.updatedCover || "");
      } else {
        const result = await deleteImageFromProject(urlToDelete);
        if (!result.success) {
          notify(result.message, false);
          return;
        }
        setImages((prevImages) => {
          const newImages = prevImages.filter(url => url !== urlToDelete);
          if (primaryImage === urlToDelete) {
            setPrimaryImage(newImages.length > 0 ? newImages[0] : "");
          }
          return newImages;
        });
      }
      notify(`Deleted successfully`, true);
    } catch (error) {
      console.error("Error deleting image:", error);
      notify("Failed to delete image", false);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleDeleteAll = async () => {
    if (!isAdmin) {
      notify("You have no privileges doing this", false);
      return;
    }

    setIsDeleting("all");
    try {
      const urlsToRemove = [...images];
      if (projectId) {
        const result = await deleteImagesFromProjectAction(projectId, urlsToRemove);
        if (!result.success) {
          notify(result.message, false);
          return;
        }
        setImages([]);
        setPrimaryImage("");
      } else {
        const results = await Promise.all(urlsToRemove.map(url => deleteImageFromProject(url)));
        const successCount = results.filter(r => r.success).length;
        setImages([]);
        setPrimaryImage("");
        if (successCount < urlsToRemove.length) {
          notify(`Deleted ${successCount} of ${urlsToRemove.length} images`, true);
          return;
        }
      }
      notify("All images deleted successfully", true);
    } catch (error) {
      console.error("Error deleting all images:", error);
      notify("Failed to delete all images", false);
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-4">
      <GalleryHeader
        imageCount={images.length}
        isDeletingAll={isDeleting === "all"}
        onDeleteAll={handleDeleteAll}
        isDeleting={isDeleting !== null}
      />

      <ImageGrid
        images={images}
        primaryImage={primaryImage}
        isDeleting={isDeleting}
        onSetPrimary={setPrimaryImage}
        onDelete={handleDelete}
      />

      <UploadButton
        onFileSelect={handleFileSelect}
        isOptimizing={isOptimizing}
        imageCount={images.length}
        fileInputRef={fileInputRef}
      />
    </div>
  );
}
