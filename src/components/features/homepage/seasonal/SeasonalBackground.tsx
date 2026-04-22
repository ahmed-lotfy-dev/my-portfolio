"use client";

import { useMemo } from "react";

type Season = "spring" | "summer" | "autumn" | "winter";

const getSeason = (): Season => {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "autumn";
  return "winter";
};

const seasonalThemes: Record<Season, { primary: string; secondary: string }> = {
  spring: {
    primary: "rgba(168, 230, 207, 0.06)",
    secondary: "rgba(255, 211, 182, 0.04)",
  },
  summer: {
    primary: "rgba(212, 175, 55, 0.06)",
    secondary: "rgba(255, 69, 0, 0.03)",
  },
  autumn: {
    primary: "rgba(211, 84, 0, 0.06)",
    secondary: "rgba(192, 57, 43, 0.03)",
  },
  winter: {
    primary: "rgba(225, 245, 254, 0.05)",
    secondary: "rgba(176, 190, 197, 0.03)",
  },
};

export function SeasonalBackground() {
  const season = useMemo(() => getSeason(), []);
  const theme = seasonalThemes[season];

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-size-[24px_24px]" />

      {/* Static accent orbs - visible in background */}
      <div
        className="absolute -right-20 -top-20 h-[400px] w-[400px] rounded-full blur-[100px]"
        style={{ backgroundColor: theme.primary }}
      />
      <div
        className="absolute -bottom-32 -left-32 h-[450px] w-[450px] rounded-full blur-[100px]"
        style={{ backgroundColor: theme.secondary }}
      />
    </div>
  );
}
