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
  const heroRef = useRef<HTMLElement | null>(null);

  const handleScroll = useCallback(() => {
    if (!heroRef.current) return;

    const hero = heroRef.current;
    const rect = hero.getBoundingClientRect();
    const heroHeight = hero.offsetHeight;
    const scrollProgress = -rect.top / heroHeight;

    // Determine which section we're in (0-3)
    const clampedProgress = Math.min(Math.max(scrollProgress, 0), sections.length - 1);
    const currentSection = Math.floor(clampedProgress);

    if (currentSection !== prevSection.current && currentSection >= 0 && currentSection < sections.length) {
      prevSection.current = currentSection;
      onSectionChange(currentSection);
    }
  }, [sections, onSectionChange]);

  useEffect(() => {
    // Find the hero element
    heroRef.current = document.getElementById("hero");

    // Use GSAP ScrollTrigger for smooth scroll-linked animation
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        onUpdate: handleScroll,
      });
    });

    return () => ctx.revert();
  }, [handleScroll]);

  return null; // This component is invisible
}
