"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
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
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/src/components/ui/carousel";
import { isGifUrl, isHostedVideoFileUrl } from "@/src/lib/utils/mediaUrl";

interface ImageCarouselProps {
  images: string[];
  title: string;
  isMobile?: boolean; // Mobile layout adjustment for inline display
  className?: string; // Additional classes for wrapper
}

export function ImageCarousel({
  images,
  title,
  isMobile = false,
  className,
}: ImageCarouselProps) {
  const [open, setOpen] = useState(false);
  const [initialSlide, setInitialSlide] = useState(0);
  const locale = useLocale();

  // Sync state between inline carousel and modal carousel
  const [inlineApi, setInlineApi] = useState<CarouselApi | null>(null);
  const [modalApi, setModalApi] = useState<CarouselApi | null>(null);
  const [currentInlineIndex, setCurrentInlineIndex] = useState(0);
  const [currentModalIndex, setCurrentModalIndex] = useState(0);

  // Track inline carousel changes
  const onInlineSelect = useCallback(() => {
    if (!inlineApi) return;
    setCurrentInlineIndex(inlineApi.selectedScrollSnap());
  }, [inlineApi]);

  useEffect(() => {
    if (!inlineApi) return;
    inlineApi.on("select", onInlineSelect);
    setCurrentInlineIndex(inlineApi.selectedScrollSnap());
    return () => {
      inlineApi.off("select", onInlineSelect);
    };
  }, [inlineApi, onInlineSelect]);

  // Track modal carousel changes
  const onModalSelect = useCallback(() => {
    if (!modalApi) return;
    setCurrentModalIndex(modalApi.selectedScrollSnap());
  }, [modalApi]);

  useEffect(() => {
    if (!modalApi) return;
    modalApi.on("select", onModalSelect);
    setCurrentModalIndex(modalApi.selectedScrollSnap());
    return () => {
      modalApi.off("select", onModalSelect);
    };
  }, [modalApi, onModalSelect]);

  // Handler to open modal at specific index
  const openViewer = (index: number) => {
    setInitialSlide(index);
    setOpen(true);
  };

  if (!images || images.length === 0) return null;

  const isSingle = images.length === 1;

  /**
   * INLINE RENDERER
   * Renders the single image or carousel card that sits on the page.
   */
  const renderInlineImage = (
    src: string,
    index: number,
    priority: boolean = false
  ) => {
    const gif = isGifUrl(src);
    const isVideo = isHostedVideoFileUrl(src);

    if (isVideo) {
      return (
        <div
          className="relative w-full h-full group cursor-zoom-in"
          onClick={() => openViewer(index)}
          role="button"
          tabIndex={0}
          aria-label={`View ${title} video ${index + 1} in full screen`}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openViewer(index);
            }
          }}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <video
              src={src}
              className="absolute inset-0 z-10 h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
              controls
              playsInline
              preload="metadata"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none">
            <div className="bg-black/50 backdrop-blur-sm rounded-full p-3">
              <ZoomIn className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      );
    }

    return (
    <div
      className="relative w-full h-full group cursor-zoom-in"
      onClick={() => openViewer(index)}
      role="button"
      tabIndex={0}
      aria-label={`View ${title} image ${index + 1} in full screen`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openViewer(index);
        }
      }}
    >
      {/* Blurred Background Layer — skip for GIFs since optimization is blocked */}
      {!gif && (
        <div className="absolute inset-0 overflow-hidden rounded-2xl md:rounded-4xl">
          <Image
            src={src}
            alt={`${title} - Background`}
            fill
            className="object-cover blur-3xl opacity-50 scale-110 grayscale"
            aria-hidden="true"
          />
        </div>
      )}

      {/* Main Display Image */}
      <div className="relative w-full h-full flex items-center justify-center">
        <Image
          src={src}
          alt={`${title} - ${index + 1}`}
          fill
          className="object-contain z-10 transition-transform duration-500 group-hover:scale-[1.02]"
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) min(896px, 92vw), min(1440px, 94vw)"
          unoptimized={gif}
        />
      </div>

      {/* Zoom Indicator Overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none">
        <div className="bg-black/50 backdrop-blur-sm rounded-full p-3">
          <ZoomIn className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );};


  return (
    <>
      {/* Inline display: phone-style portrait on small screens only; wide 16:9 from md+ */}
      <div
        className={cn(
          "relative mx-auto mb-12 md:mb-16 select-none",
          isMobile
            ? [
                "w-full max-w-[min(420px,100%)] aspect-9/16",
                "sm:max-w-md",
                "md:aspect-video md:max-w-6xl md:w-full",
                "lg:max-w-7xl xl:max-w-[min(90rem,96vw)]",
              ]
            : [
                "w-full aspect-video",
                "max-w-6xl md:max-w-7xl xl:max-w-[min(92rem,96vw)]",
              ],
          className
        )}
      >
        {isSingle ? (
          <div className="absolute inset-0">
            <div className="w-full h-full shadow-2xl border border-white/10 ring-1 ring-white/10 bg-secondary/5 rounded-2xl md:rounded-4xl overflow-hidden p-1">
              {renderInlineImage(images[0], 0, true)}
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 group/carousel">
            <Carousel
              opts={{
                align: "start",
                loop: true,
                direction: locale === "ar" ? "rtl" : "ltr",
              }}
              setApi={setInlineApi}
              className="w-full h-full"
            >
              <CarouselContent className="h-full m-0">
                {images.map((src, index) => (
                  <CarouselItem key={index} className="p-0 h-full">
                    <div className="w-full h-full shadow-2xl border border-white/10 ring-1 ring-white/10 bg-secondary/5 rounded-2xl md:rounded-4xl overflow-hidden p-1">
                      {renderInlineImage(src, index, index === 0)}
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              {/* Slide counter: dir=ltr so Arabic pages don’t show "19 / 4" for "4 / 19" */}
              <div
                dir="ltr"
                className="absolute bottom-4 inset-e-4 bg-black/50 backdrop-blur-sm text-white/80 px-3 py-1.5 rounded-full text-sm font-medium z-20 pointer-events-none transition-opacity duration-300 tabular-nums"
              >
                {currentInlineIndex + 1} / {images.length}
              </div>

              {/* Navigation Arrows */}
              <CarouselPrevious className="hidden md:flex opacity-0 group-hover/carousel:opacity-100 transition-opacity absolute left-4 h-12 w-12 bg-black/50 hover:bg-black/80 border-white/10 text-white/90 z-30" />
              <CarouselNext className="hidden md:flex opacity-0 group-hover/carousel:opacity-100 transition-opacity absolute right-4 h-12 w-12 bg-black/50 hover:bg-black/80 border-white/10 text-white/90 z-30" />
              
              {/* Navigation Dots */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                {images.map((_, index) => (
                  <button
                    key={index}
                    className={cn(
                      "rounded-full transition-all duration-300 ease-out",
                      index === currentInlineIndex
                        ? "w-6 h-2.5 bg-primary shadow-[0_0_8px_2px] shadow-primary/50"
                        : "w-2 h-2 bg-white/20 hover:bg-white/50 hover:scale-125"
                    )}
                    onClick={() => inlineApi?.scrollTo(index)}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </Carousel>
          </div>
        )}
      </div>

      {/* Fullscreen Modal Viewer */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[95vw] md:w-[85vw] h-[80vh] md:h-[85vh] max-w-none p-0 bg-transparent border-none shadow-none ring-0 focus:outline-none flex flex-col items-center justify-center pointer-events-none">
          <DialogHeader className="sr-only">
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              Full view of {title}
              {!isSingle && ` - Image ${currentModalIndex + 1} of ${images.length}`}
            </DialogDescription>
          </DialogHeader>

          <div className="pointer-events-auto relative w-full h-full flex items-center justify-center bg-black/95 backdrop-blur-2xl border border-white/10 rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-50 text-white/50 hover:text-white bg-black/20 hover:bg-black/40 rounded-full cursor-pointer h-12 w-12"
              onClick={() => setOpen(false)}
            >
              <X className="w-8 h-8" />
            </Button>

            {/* Image Counter */}
            {!isSingle && (
              <div
                dir="ltr"
                className="absolute top-4 inset-s-4 z-50 bg-black/50 backdrop-blur-sm text-white/80 px-3 py-1.5 rounded-full text-sm font-medium tabular-nums"
              >
                {currentModalIndex + 1} / {images.length}
              </div>
            )}

            <Carousel
              opts={{
                align: "center",
                loop: true,
                startIndex: initialSlide,
                direction: locale === "ar" ? "rtl" : "ltr",
              }}
              setApi={setModalApi}
              className="w-full h-full"
            >
              <CarouselContent className="h-full m-0">
                {images.map((src, index) => (
                  <CarouselItem key={index} className="p-0 h-full w-full">
                    <div className="w-full h-full overflow-y-auto">
                      <div className="min-h-full w-full flex items-center justify-center p-4 md:p-8">
                        {isHostedVideoFileUrl(src) ? (
                          <video
                            src={src}
                            className="max-h-[85vh] w-full object-contain shadow-2xl rounded-sm"
                            controls
                            playsInline
                            preload="metadata"
                          />
                        ) : (
                          <div className="relative w-full h-[70vh] md:h-[80vh]">
                            <Image
                              src={src}
                              alt={`${title} - ${index + 1}`}
                              fill
                              sizes="100vw"
                              className="object-contain shadow-2xl rounded-sm"
                              priority={index === initialSlide}
                              quality={100}
                              unoptimized={isGifUrl(src)}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {images.length > 1 && (
               <>
                 <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 bg-black/20 hover:bg-black/40 border-none text-white/50 hover:text-white cursor-pointer z-50" />
                 <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 bg-black/20 hover:bg-black/40 border-none text-white/50 hover:text-white cursor-pointer z-50" />
                 
                 {/* Modal Navigation Dots */}
                 <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex gap-2">
                   {images.map((_, index) => (
                     <button
                       key={index}
                       className={cn(
                         "w-2 h-2 rounded-full transition-all duration-300",
                         index === currentModalIndex
                           ? "bg-white w-4"
                           : "bg-white/30 hover:bg-white/50"
                       )}
                       onClick={() => modalApi?.scrollTo(index)}
                       aria-label={`Go to slide ${index + 1}`}
                     />
                   ))}
                 </div>
               </>
              )}
            </Carousel>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
