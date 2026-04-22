"use client";

import { useMemo } from "react";
import { m, AnimatePresence, useInView } from "motion/react";
import { useRef } from "react";
import { cn } from "@/src/lib/utils";

type Season = "spring" | "summer" | "autumn" | "winter";

const getSeason = (): Season => {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "autumn";
  return "winter";
};

const seasonalThemes: Record<Season, { primary: string; secondary: string; glow: string }> = {
  spring: {
    primary: "rgba(168, 230, 207, 0.15)", // Mint
    secondary: "rgba(255, 211, 182, 0.1)", // Peach
    glow: "rgba(168, 230, 207, 0.2)",
  },
  summer: {
    primary: "rgba(212, 175, 55, 0.15)", // Gold
    secondary: "rgba(255, 69, 0, 0.08)", // Orange
    glow: "rgba(212, 175, 55, 0.2)",
  },
  autumn: {
    primary: "rgba(211, 84, 0, 0.15)", // Burnt Orange
    secondary: "rgba(192, 57, 43, 0.08)", // Crimson
    glow: "rgba(211, 84, 0, 0.2)",
  },
  winter: {
    primary: "rgba(225, 245, 254, 0.12)", // Light Blue
    secondary: "rgba(176, 190, 197, 0.08)", // Silver/Grey
    glow: "rgba(225, 245, 254, 0.15)",
  },
};

export function SeasonalBackground() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const season = useMemo(() => getSeason(), []);
  const theme = seasonalThemes[season];

  return (
    <div ref={ref} className="absolute inset-0 -z-30 overflow-hidden pointer-events-none">
      {/* Base Grid - Constant */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[32px_32px]" />

      {isInView && (
        <AnimatePresence mode="wait">
          <m.div
            key={season}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="relative h-full w-full"
          >
            {/* Main Seasonal Orb - animated only when in view */}
            <m.div
              animate={{
                scale: [1, 1.2, 1],
                x: [0, 50, 0],
                y: [0, -30, 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute right-0 top-1/4 h-[75vw] w-[75vw] -translate-y-1/2 translate-x-1/2 rounded-full blur-[100px] sm:h-[600px] sm:w-[600px] sm:blur-[140px]"
              style={{ backgroundColor: theme.primary }}
            />

            {/* Secondary Seasonal Orb */}
            <m.div
              animate={{
                scale: [1, 1.1, 1],
                x: [0, -40, 0],
                y: [0, 40, 0],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute bottom-0 left-0 h-screen w-screen -translate-x-1/2 translate-y-1/2 rounded-full blur-[100px] sm:h-[700px] sm:w-[700px] sm:blur-[150px]"
              style={{ backgroundColor: theme.secondary }}
            />

            {/* Extra Accent for 'Pro Max' feel */}
            <m.div 
              className="absolute top-1/2 left-1/4 h-64 w-64 rounded-full blur-[120px]"
              style={{ backgroundColor: theme.glow }}
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </m.div>
        </AnimatePresence>
      )}
    </div>
  );
}
