"use client";

import { useState, useEffect, useCallback } from "react";

export function useSectionDetection(sectionIds: string[], offset = 100) {
  const [activeSection, setActiveSection] = useState(0);

  const detectSection = useCallback(() => {
    const scrollY = window.scrollY + offset;

    for (let i = sectionIds.length - 1; i >= 0; i--) {
      const el = document.getElementById(sectionIds[i]);
      if (el && el.offsetTop <= scrollY) {
        if (i !== activeSection) {
          setActiveSection(i);
        }
        return;
      }
    }
    if (activeSection !== 0) setActiveSection(0);
  }, [sectionIds, offset, activeSection]);

  useEffect(() => {
    window.addEventListener("scroll", detectSection, { passive: true });
    detectSection();
    return () => window.removeEventListener("scroll", detectSection);
  }, [detectSection]);

  return activeSection;
}
