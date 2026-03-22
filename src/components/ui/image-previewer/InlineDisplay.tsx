
import Image from "next/image";
import { ZoomIn } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface ImageItem {
  src: string;
  alt: string;
}

interface InlineDisplayProps {
  image: ImageItem;
  isMobile?: boolean;
  aspectRatioClass: string;
  className?: string;
  showZoomIndicator?: boolean;
  isSingle: boolean;
  imageCount: number;
  onOpen: () => void;
  priority?: boolean;
}

export function InlineDisplay({
  image,
  isMobile,
  aspectRatioClass,
  className,
  showZoomIndicator,
  isSingle,
  imageCount,
  onOpen,
  priority
}: InlineDisplayProps) {
  return (
    <div
      className={cn(
        "relative w-full mx-auto mb-12 md:mb-16 select-none",
        isMobile ? "max-w-sm md:max-w-md" : "max-w-5xl",
        className
      )}
    >
      <div
        className={cn(
          "w-full shadow-2xl border border-white/10 ring-1 ring-white/10 bg-secondary/5 rounded-2xl md:rounded-4xl overflow-hidden p-1",
          aspectRatioClass
        )}
      >
        <div
          className="relative w-full h-full group cursor-zoom-in"
          onClick={onOpen}
          role="button"
          tabIndex={0}
          aria-label={`View ${isSingle ? 'image' : 'image gallery'} in full screen`}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onOpen();
            }
          }}
        >
          {/* Blurred Background Layer */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl md:rounded-4xl">
            <Image
              src={image.src}
              alt=""
              fill
              className="object-cover blur-3xl opacity-50 scale-110 grayscale-20"
              aria-hidden="true"
              sizes="(max-width: 768px) 100vw, 1200px"
            />
          </div>

          {/* Main Display Image */}
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-contain z-10 transition-transform duration-500 group-hover:scale-[1.02]"
              priority={priority}
              sizes="(max-width: 768px) 100vw, 1200px"
            />
          </div>

          {/* Zoom Indicator Overlay */}
          {showZoomIndicator && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none">
              <div className="bg-black/50 backdrop-blur-sm rounded-full p-3">
                <ZoomIn className="w-6 h-6 text-white" />
              </div>
            </div>
          )}

          {/* Multiple Images Indicator */}
          {!isSingle && (
            <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white/80 px-3 py-1.5 rounded-full text-sm font-medium z-20">
              {imageCount} images
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
