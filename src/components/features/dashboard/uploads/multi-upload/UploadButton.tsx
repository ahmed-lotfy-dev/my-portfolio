
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { ChangeEvent, RefObject } from "react";

interface UploadButtonProps {
  onFileSelect: (e: ChangeEvent<HTMLInputElement>) => void;
  isOptimizing: boolean;
  imageCount: number;
  fileInputRef: RefObject<HTMLInputElement | null>;
}

export function UploadButton({
  onFileSelect,
  isOptimizing,
  imageCount,
  fileInputRef
}: UploadButtonProps) {
  return (
    <div className="space-y-4">
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
              <span>{imageCount === 0 ? "Upload Images" : "Add More Images"}</span>
            </>
          )}
        </Button>
      </div>

      <Input
        type="file"
        accept="image/*"
        multiple
        name="images-upload"
        onChange={onFileSelect}
        ref={fileInputRef}
        style={{ display: "none" }}
      />

      <p className="text-sm text-muted-foreground text-center">
        Supported: JPG, PNG, WEBP (Max 10MB). First image or selected 'Cover' will be used as the preview card.
      </p>
    </div>
  );
}
