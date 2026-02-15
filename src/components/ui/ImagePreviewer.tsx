"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import Image from "next/image";
import { cn } from "@/src/lib/utils";
import { X, ZoomIn } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/src/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/src/components/ui/carousel";

/**
 * Normalized image item structure
 */
interface ImageItem {
  src: string;
  alt: string;
}

/**
 * Props for the ImagePreviewer component
 */
interface ImagePreviewerProps {
  /** Single image URL or array of images */
  images: string | string[] | ImageItem[] | null | undefined;
  /** Title for accessibility and dialog header */
  title: string;
  /** Optional aspect ratio for the container */
  aspectRatio?: "video" | "square" | "portrait" | "auto";
  /** Mobile layout adjustment */
  isMobile?: boolean;
  /** Additional classes for wrapper */
  className?: string;
  /** Show zoom indicator on hover */
  showZoomIndicator?: boolean;
  /** Callback when an image is clicked */
  onImageClick?: (index: number) => void;
  /** Priority loading for first image */
  priority?: boolean;
}

/**
 * A reusable image previewer component that handles both single and multiple images.
 * Features:
 * - Shows cover/default image inline
 * - Click to open fullscreen modal with carousel for multiple images
 * - Touch swipe navigation in modal (using shadcn Carousel)
 * - Keyboard navigation (arrow keys, escape)
 * - Accessible with proper ARIA labels
 * - Responsive design
 * - Blur background effect for better visual presentation
 *
 * @example
 * // Single image
 * <ImagePreviewer images="https://example.com/image.jpg" title="Project Screenshot" />
 *
 * @example
 * // Multiple images - shows first image inline, opens carousel on click
 * <ImagePreviewer images={["img1.jpg", "img2.jpg"]} title="Gallery" />
 *
 * @example
 * // With image items (custom alt texts)
 * <ImagePreviewer
 *   images={[{ src: "img1.jpg", alt: "Screenshot 1" }, { src: "img2.jpg", alt: "Screenshot 2" }]}
 *   title="Project Gallery"
 * />
 */
export function ImagePreviewer({
  images,
  title,
  aspectRatio = "video",
  isMobile = false,
  className,
  showZoomIndicator = true,
  onImageClick,
  priority = true,
}: ImagePreviewerProps) {
  const [open, setOpen] = useState(false);
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Normalize images to ImageItem array
  const normalizedImages = useMemo((): ImageItem[] => {
    if (!images) return [];

    // Handle single string
    if (typeof images === "string") {
      return [{ src: images, alt: title }];
    }

    // Handle array of strings or ImageItems
    return images.map((item, index) => {
      if (typeof item === "string") {
        return { src: item, alt: `${title} - ${index + 1}` };
      }
      return item;
    });
  }, [images, title]);

  // Return null if no valid images
  if (normalizedImages.length === 0) return null;

  const isSingle = normalizedImages.length === 1;

  // Aspect ratio classes
  const aspectRatioClasses = {
    video: "aspect-video",
    square: "aspect-square",
    portrait: "aspect-[9/16]",
    auto: "aspect-auto",
  };

  // Open modal
  const openViewer = useCallback(() => {
    setOpen(true);
    onImageClick?.(0);
  }, [onImageClick]);

  // Sync carousel index
  useEffect(() => {
    if (!carouselApi) return;

    const onSelect = () => {
      setCurrentIndex(carouselApi.selectedScrollSnap());
    };

    // Set initial index
    setCurrentIndex(carouselApi.selectedScrollSnap());

    carouselApi.on("select", onSelect);
    return () => {
      carouselApi.off("select", onSelect);
    };
  }, [carouselApi]);

  // Keyboard navigation
  useEffect(() => {
    if (!open || !carouselApi) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          carouselApi.scrollPrev();
          break;
        case "ArrowRight":
          e.preventDefault();
          carouselApi.scrollNext();
          break;
        case "Escape":
          setOpen(false);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, carouselApi]);

  // Aspect ratio for inline display
  const inlineAspectRatio = isMobile ? "aspect-[9/16]" : aspectRatioClasses[aspectRatio];

  return (
    <>
      {/* Inline Display - Shows cover/first image */}
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
            inlineAspectRatio
          )}
        >
          <div
            className="relative w-full h-full group cursor-zoom-in"
            onClick={openViewer}
            role="button"
            tabIndex={0}
            aria-label={`View ${isSingle ? 'image' : 'image gallery'} in full screen`}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openViewer();
              }
            }}
          >
            {/* Blurred Background Layer for visual effect */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl md:rounded-4xl">
              <Image
                src={normalizedImages[0].src}
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
                src={normalizedImages[0].src}
                alt={normalizedImages[0].alt}
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
                {normalizedImages.length} images
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fullscreen Modal Viewer */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[95vw] md:w-[85vw] h-[80vh] md:h-[85vh] max-w-none p-0 bg-transparent border-none shadow-none ring-0 focus:outline-none flex flex-col items-center justify-center pointer-events-none">
          <DialogHeader className="sr-only">
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              Full view of {title}
              {!isSingle && ` - Image ${currentIndex + 1} of ${normalizedImages.length}`}
            </DialogDescription>
          </DialogHeader>

          <div className="pointer-events-auto relative w-full h-full flex items-center justify-center bg-black/95 backdrop-blur-2xl border border-white/10 rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-50 text-white/50 hover:text-white bg-black/20 hover:bg-black/40 rounded-full cursor-pointer h-12 w-12"
              onClick={() => setOpen(false)}
              aria-label="Close image viewer"
            >
              <X className="w-8 h-8" />
            </Button>

            {/* Image Counter */}
            {!isSingle && (
              <div className="absolute top-4 left-4 z-50 bg-black/50 backdrop-blur-sm text-white/80 px-3 py-1.5 rounded-full text-sm font-medium">
                {currentIndex + 1} / {normalizedImages.length}
              </div>
            )}

            {/* Shadcn Carousel with swipe support */}
            <Carousel
              opts={{
                loop: true,
                align: "center",
              }}
              setApi={setCarouselApi}
              className="w-full h-full"
            >
              <CarouselContent className="h-full m-0">
                {normalizedImages.map((image, index) => (
                  <CarouselItem
                    key={`${image.src}-${index}`}
                    className="h-full basis-full p-0"
                  >
                    <div className="w-full h-full flex items-center justify-center p-4 md:p-8 overflow-y-auto">
                      <div className="relative w-full h-full flex items-center justify-center">
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          className="object-contain"
                          priority={index === 0}
                          quality={100}
                          sizes="100vw"
                        />
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              {/* Navigation Arrows */}
              {!isSingle && (
                <>
                  <CarouselPrevious className="left-4 top-1/2 -translate-y-1/2 h-12 w-12 bg-black/20 hover:bg-black/40 border-none text-white/50 hover:text-white cursor-pointer z-50" />
                  <CarouselNext className="right-4 top-1/2 -translate-y-1/2 h-12 w-12 bg-black/20 hover:bg-black/40 border-none text-white/50 hover:text-white cursor-pointer z-50" />
                </>
              )}
            </Carousel>

            {/* Navigation Dots in Modal */}
            {!isSingle && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex gap-2">
                {normalizedImages.map((_, index) => (
                  <button
                    key={index}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all duration-300",
                      index === currentIndex
                        ? "bg-white w-4"
                        : "bg-white/30 hover:bg-white/50"
                    )}
                    onClick={() => carouselApi?.scrollTo(index)}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ImagePreviewer;
