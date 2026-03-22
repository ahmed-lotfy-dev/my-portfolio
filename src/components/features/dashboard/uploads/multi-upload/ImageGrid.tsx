
import { ImageItem } from "./ImageItem";

interface ImageGridProps {
  images: string[];
  primaryImage: string;
  isDeleting: string | null;
  onSetPrimary: (url: string) => void;
  onDelete: (url: string) => void;
}

export function ImageGrid({
  images,
  primaryImage,
  isDeleting,
  onSetPrimary,
  onDelete
}: ImageGridProps) {
  if (images.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-6">
      {images.map((url, index) => (
        <ImageItem
          key={`${url}-${index}`}
          url={url}
          index={index}
          isPrimary={url === primaryImage}
          isBeingDeleted={isDeleting === url || isDeleting === "all"}
          onSetPrimary={onSetPrimary}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
