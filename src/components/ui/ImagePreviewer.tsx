
"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { type CarouselApi } from "@/src/components/ui/carousel";

// Sub-components
import { InlineDisplay } from "./image-previewer/InlineDisplay";
import { LightboxViewer } from "./image-previewer/LightboxViewer";

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
  images: string | string[] | ImageItem[] | null | undefined;
  title: string;
  aspectRatio?: "video" | "square" | "portrait" | "auto";
  isMobile?: boolean;
  className?: string;
  showZoomIndicator?: boolean;
  onImageClick?: (index: number) => void;
  priority?: boolean;
}

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

  const normalizedImages = useMemo((): ImageItem[] => {
    if (!images) return [];
    if (typeof images === "string") return [{ src: images, alt: title }];
    return images.map((item, index) => {
      if (typeof item === "string") return { src: item, alt: `${title} - ${index + 1}` };
      return item;
    });
  }, [images, title]);

  if (normalizedImages.length === 0) return null;

  const isSingle = normalizedImages.length === 1;
  const aspectRatioClasses = {
    video: "aspect-video",
    square: "aspect-square",
    portrait: "aspect-[9/16]",
    auto: "aspect-auto",
  };

  const openViewer = useCallback(() => {
    setOpen(true);
    onImageClick?.(0);
  }, [onImageClick]);

  useEffect(() => {
    if (!carouselApi) return;
    const onSelect = () => setCurrentIndex(carouselApi.selectedScrollSnap());
    setCurrentIndex(carouselApi.selectedScrollSnap());
    carouselApi.on("select", onSelect);
    return () => { carouselApi.off("select", onSelect); };
  }, [carouselApi]);

  useEffect(() => {
    if (!open || !carouselApi) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft": e.preventDefault(); carouselApi.scrollPrev(); break;
        case "ArrowRight": e.preventDefault(); carouselApi.scrollNext(); break;
        case "Escape": setOpen(false); break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, carouselApi]);

  const inlineAspectRatio = isMobile ? "aspect-[9/16]" : aspectRatioClasses[aspectRatio];

  return (
    <>
      <InlineDisplay
        image={normalizedImages[0]}
        isMobile={isMobile}
        aspectRatioClass={inlineAspectRatio}
        className={className}
        showZoomIndicator={showZoomIndicator}
        isSingle={isSingle}
        imageCount={normalizedImages.length}
        onOpen={openViewer}
        priority={priority}
      />

      <LightboxViewer
        open={open}
        onOpenChange={setOpen}
        images={normalizedImages}
        currentIndex={currentIndex}
        title={title}
        isSingle={isSingle}
        setCarouselApi={setCarouselApi}
        onDotClick={(index) => carouselApi?.scrollTo(index)}
      />
    </>
  );
}

export default ImagePreviewer;
