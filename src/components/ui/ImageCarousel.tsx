"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/src/lib/utils";
import { X } from "lucide-react";
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
} from "@/src/components/ui/carousel";

interface ImageCarouselProps {
  images: string[];
  title: string;
  isMobile?: boolean; // Mobile layout adjustment for inline display
  className?: string; // Additional classes for wrapper
}

export function ImageCarousel({ images, title, isMobile = false, className }: ImageCarouselProps) {
  const [open, setOpen] = useState(false);
  const [initialSlide, setInitialSlide] = useState(0);

  // If no images, return null
  if (!images || images.length === 0) return null;

  const isSingle = images.length === 1;

  // Handler to open modal at specific index
  const openViewer = (index: number) => {
    setInitialSlide(index);
    setOpen(true);
  };

  /**
   * INLINE RENDERER
   * Renders the single image or carousel card that sits on the page.
   */
  const renderInlineImage = (src: string, index: number, priority: boolean = false) => (
    <div
      className="relative w-full h-full group cursor-zoom-in"
      onClick={() => openViewer(index)}
    >
      {/* Blurred Background Layer for "Full" effect */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl md:rounded-4xl">
        <Image
          src={src}
          alt={`${title} - Background`}
          fill
          className="object-cover blur-3xl opacity-50 scale-110 grayscale-20"
          aria-hidden="true"
        />
      </div>

      {/* Main Display Image */}
      <div className="relative w-full h-full flex items-center justify-center">
        <Image
          src={src}
          alt={`${title} - ${index + 1}`}
          fill
          className="object-contain z-10 transition-transform duration-500 group-hover:scale-[1.02]"
          priority={priority}
          sizes="(max-width: 768px) 100vw, 1200px"
        />
      </div>
    </div>
  );

  return (
    <>
      {/* Inline Display Component */}
      <div
        className={cn(
          "relative w-full mx-auto mb-12 md:mb-16 select-none",
          isMobile
            ? "max-w-sm md:max-w-md aspect-[9/19]"
            : "max-w-5xl aspect-video",
          className
        )}
      >
        {isSingle ? (
          <div className="w-full h-full shadow-2xl border border-white/10 ring-1 ring-white/10 bg-secondary/5 rounded-2xl md:rounded-4xl overflow-hidden p-1">
            {renderInlineImage(images[0], 0, true)}
          </div>
        ) : (
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full h-full"
          >
            <CarouselContent className="h-full -ml-4">
              {images.map((src, index) => (
                <CarouselItem key={index} className="pl-4 h-full">
                  <div className="w-full h-full shadow-2xl border border-white/10 ring-1 ring-white/10 bg-secondary/5 rounded-2xl md:rounded-4xl overflow-hidden">
                    {renderInlineImage(src, index, index === 0)}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-12 h-12 w-12 bg-black/20 hover:bg-black/40 border-white/10 text-white/70" />
            <CarouselNext className="hidden md:flex -right-12 h-12 w-12 bg-black/20 hover:bg-black/40 border-white/10 text-white/70" />
          </Carousel>
        )}
      </div>

      {/* Fullscreen Modal Viewer */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent hideClose className="w-[95vw] md:w-[85vw] h-[80vh] md:h-[85vh] max-w-none p-0 bg-transparent border-none shadow-none ring-0 focus:outline-none flex flex-col items-center justify-center pointer-events-none">
          <DialogHeader className="sr-only">
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>Full view of {title}</DialogDescription>
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

            <Carousel
              opts={{
                align: "center",
                loop: true,
                startIndex: initialSlide,
              }}
              className="w-full h-full"
            >
              <CarouselContent className="h-full ml-0">
                {images.map((src, index) => (
                  <CarouselItem key={index} className="pl-0 h-full w-full">
                    {/* Scrollable Container for Tall Images */}
                    <div className="w-full h-full overflow-y-auto">
                      <div className="min-h-full w-full flex items-center justify-center p-4 md:p-8">
                        <Image
                          src={src}
                          alt={`${title} - ${index + 1}`}
                          width={0}
                          height={0}
                          sizes="100vw"
                          className="w-full h-auto shadow-2xl rounded-sm"
                          priority={index === initialSlide}
                          quality={100}
                        />
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {images.length > 1 && (
                <>
                  <CarouselPrevious className="left-4 h-12 w-12 bg-black/20 hover:bg-black/40 border-none text-white/50 hover:text-white cursor-pointer" />
                  <CarouselNext className="right-4 h-12 w-12 bg-black/20 hover:bg-black/40 border-none text-white/50 hover:text-white cursor-pointer" />
                </>
              )}
            </Carousel>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
