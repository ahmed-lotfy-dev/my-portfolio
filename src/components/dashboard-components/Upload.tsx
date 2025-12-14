import { ChangeEvent, useRef, useState } from "react";
import { Input } from "@/src/components/ui/input";
import { notify } from "@/src/lib/utils/toast";
import { Button } from "@/src/components/ui/button";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Loader2 } from "lucide-react";

type UploadProps = {
  setImageUrl: React.Dispatch<React.SetStateAction<string>>;
  imageType: string;
  currentImageUrl?: string;
  itemTitle?: string; // Optional title for better file naming
};

function Upload({ setImageUrl, imageType, currentImageUrl, itemTitle }: UploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentImageUrl || null
  );
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const t = useTranslations("projects");

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const file = e.target.files[0];

    // Validate file type
    if (!file.type.startsWith("image/")) {
      notify("Please select an image file", false);
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      notify("Image must be less than 10MB", false);
      return;
    }

    setSelectedFile(file);

    // Create instant preview using FileReader
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadAndOptimize = async () => {
    if (!selectedFile) {
      notify("Please select an image first", false);
      return;
    }

    setIsOptimizing(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("image-type", imageType);
      
      if (itemTitle) {
        formData.append("item-title", itemTitle);
      }

      if (currentImageUrl) {
        formData.append("old-image-url", currentImageUrl);
      }

      const response = await fetch("/api/upload/optimize", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        notify(`${data.message} (${data.stats.reduction} smaller)`, true);
        setImageUrl(data.imageLink);
        setPreviewUrl(data.imageLink);
      } else {
        notify(data.message, false);
      }
    } catch (error) {
      console.error("Error optimizing image:", error);
      notify("Failed to optimize image", false);
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Preview */}
      {previewUrl && (
        <div className="relative w-full max-w-md h-64 border rounded-lg overflow-hidden">
          <Image
            src={previewUrl}
            alt="Preview"
            fill
            className="object-contain"
            unoptimized={previewUrl.startsWith("data:")}
          />
        </div>
      )}

      {/* File Input */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isOptimizing}
        >
          {t("select_image") || "Select Image"}
        </Button>

        {selectedFile && (
          <Button
            type="button"
            onClick={handleUploadAndOptimize}
            disabled={isOptimizing}
          >
            {isOptimizing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("optimizing") || "Optimizing..."}
              </>
            ) : (
              t("upload_optimize") || "Upload & Optimize"
            )}
          </Button>
        )}
      </div>

      <Input
        type="file"
        accept="image/*"
        name="image"
        onChange={handleFileSelect}
        ref={fileInputRef}
        style={{ display: "none" }}
      />

      {selectedFile && (
        <p className="text-sm text-muted-foreground">
          Selected: {selectedFile.name} (
          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
        </p>
      )}
    </div>
  );
}

export { Upload };
