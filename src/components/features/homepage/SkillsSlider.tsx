"use client";

import Image from "next/image";
import { motion, useAnimationFrame, useMotionValue } from "framer-motion";
import { useRef, useState, useEffect } from "react";

interface Skill {
  src: any;
  alt: string;
}

interface SkillsSliderProps {
  skills: Skill[];
  isRTL: boolean;
}

export default function SkillsSlider({ skills, isRTL }: SkillsSliderProps) {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Duplicate content for seamless looping
  const duplicatedSkills = [...skills, ...skills, ...skills];

  const x = useMotionValue(0);

  useEffect(() => {
    const updateWidth = () => {
      if (!containerRef.current) return;

      const width = containerRef.current.scrollWidth;

      setContainerWidth(width);
      // RTL Fix: Start at -width/3 to position view at start of second skill set
      // This ensures content is visible immediately and enables seamless left-to-right flow
      // LTR: Start at 0 to show first skill set immediately
      const initialX = isRTL ? -width / 3 : 0;
      x.set(initialX);
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [skills, isRTL]);

  useAnimationFrame((_, delta) => {
    if (!mounted || isPaused || !containerWidth) return;

    const oneSetWidth = containerWidth / 3;
    const direction = isRTL ? 1 : -1;
    const velocity = direction * (delta / 8);

    let next = x.get() + velocity;

    // RTL Fix: Handle seamless looping with proper reset logic
    if (isRTL) {
      // RTL: Animate from -width/3 (showing second set) towards 0 (showing first set)
      // When reaching 0, reset back to -width/3 for seamless loop
      // This creates left-to-right flow with no gaps
      if (next >= 0) {
        next = -oneSetWidth;
      }
    } else {
      // LTR: Animate from 0 towards -width/3, then reset to 0
      // Original LTR behavior remains unchanged
      if (next <= -oneSetWidth) {
        next = 0;
      }
    }

    x.set(next);
  });

  if (!mounted) {
    return (
      <div className="flex gap-8 py-10 overflow-hidden opacity-0">
        {skills.map((_, i) => (
          <div
            key={i}
            className="min-w-[120px] h-20 bg-card/40 rounded-3xl"
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className="relative overflow-hidden w-full max-w-7xl mx-auto cursor-grab active:cursor-grabbing"
      dir={isRTL ? "rtl" : "ltr"}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Gradient masks */}
      {isRTL ? (
        <>
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-linear-to-l from-background via-black/0 to-transparent z-10 pointer-events-none" />
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-linear-to-r from-background via-black/0 to-transparent z-10 pointer-events-none" />
        </>
      ) : (
        <>
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-linear-to-r from-background via-black/0 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-linear-to-l from-background via-black/0 to-transparent z-10 pointer-events-none" />
        </>
      )}

      <motion.div
        ref={containerRef}
        initial={{
          opacity: 0,
        }}
        animate={{ opacity: containerWidth ? 1 : 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="inline-flex gap-8 py-10"
        style={{ x }}
      >
        {duplicatedSkills.map((skill, index) => (
          <div
            key={`${skill.alt}-${index}`}
            className="relative flex flex-col items-center justify-center min-w-[120px] sm:min-w-[150px] p-8 rounded-3xl bg-card/40 border border-border/50 backdrop-blur-md hover:border-primary/40 hover:bg-card/60 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 group"
          >
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2">
              <Image
                src={skill.src}
                alt={skill.alt}
                fill
                className="object-contain opacity-70 group-hover:opacity-100 transition-all duration-500"
              />
            </div>

            <span className="mt-6 text-sm font-semibold tracking-wider text-muted-foreground group-hover:text-primary transition-colors duration-500">
              {skill.alt}
            </span>

            <div className="absolute inset-0 rounded-3xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
