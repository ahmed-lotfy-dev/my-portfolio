"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollControllerProps {
  onSectionChange: (sectionIndex: number) => void;
  sections: string[];
}

export default function ScrollController({ onSectionChange, sections }: ScrollControllerProps) {
  const prevSection = useRef(-1);

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? scrollY / docHeight : 0;

    const clampedProgress = Math.min(Math.max(progress, 0), 0.999);
    const currentSection = Math.floor(clampedProgress * sections.length);

    if (currentSection !== prevSection.current && currentSection >= 0 && currentSection < sections.length) {
      prevSection.current = currentSection;
      onSectionChange(currentSection);
    }
  }, [sections, onSectionChange]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        onUpdate: () => handleScroll(),
      });
    });

    return () => ctx.revert();
  }, [handleScroll]);

  return null;
}
