
import { cn } from "@/src/lib/utils";
import { X } from "lucide-react";
import Image from "next/image";
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

interface ImageItem {
  src: string;
  alt: string;
}

interface LightboxViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  images: ImageItem[];
  currentIndex: number;
  title: string;
  isSingle: boolean;
  setCarouselApi: (api: CarouselApi | null) => void;
  onDotClick: (index: number) => void;
}

export function LightboxViewer({
  open,
  onOpenChange,
  images,
  currentIndex,
  title,
  isSingle,
  setCarouselApi,
  onDotClick,
}: LightboxViewerProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] md:w-[85vw] h-[80vh] md:h-[85vh] max-w-none p-0 bg-transparent border-none shadow-none ring-0 focus:outline-none flex flex-col items-center justify-center pointer-events-none">
        <DialogHeader className="sr-only">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Full view of {title}
            {!isSingle && ` - Image ${currentIndex + 1} of ${images.length}`}
          </DialogDescription>
        </DialogHeader>

        <div className="pointer-events-auto relative w-full h-full flex items-center justify-center bg-black/95 backdrop-blur-2xl border border-white/10 rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-50 text-white/50 hover:text-white bg-black/20 hover:bg-black/40 rounded-full cursor-pointer h-12 w-12"
            onClick={() => onOpenChange(false)}
            aria-label="Close image viewer"
          >
            <X className="w-8 h-8" />
          </Button>

          {/* Image Counter */}
          {!isSingle && (
            <div className="absolute top-4 left-4 z-50 bg-black/50 backdrop-blur-sm text-white/80 px-3 py-1.5 rounded-full text-sm font-medium">
              {currentIndex + 1} / {images.length}
            </div>
          )}

          {/* Carousel */}
          <Carousel
            opts={{ loop: true, align: "center" }}
            setApi={setCarouselApi}
            className="w-full h-full"
          >
            <CarouselContent className="h-full m-0">
              {images.map((image, index) => (
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

            {!isSingle && (
              <>
                <CarouselPrevious className="left-4 top-1/2 -translate-y-1/2 h-12 w-12 bg-black/20 hover:bg-black/40 border-none text-white/50 hover:text-white cursor-pointer z-50" />
                <CarouselNext className="right-4 top-1/2 -translate-y-1/2 h-12 w-12 bg-black/20 hover:bg-black/40 border-none text-white/50 hover:text-white cursor-pointer z-50" />
              </>
            )}
          </Carousel>

          {/* Navigation Dots */}
          {!isSingle && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    index === currentIndex
                      ? "bg-white w-4"
                      : "bg-white/30 hover:bg-white/50"
                  )}
                  onClick={() => onDotClick(index)}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
