"use client";

import { m } from "motion/react";

type Props = {
  children: React.ReactNode;
  delay?: number;
  type?: "fade-up" | "fade-in";
};

export default function HeroAnimations({ children, delay = 0, type = "fade-up" }: Props) {
  const variants = {
    "fade-up": {
      initial: { opacity: 0, y: 18 },
      animate: { opacity: 1, y: 0 },
    },
    "fade-in": {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
    },
  };

  const selected = variants[type];

  return (
    <m.div
      initial={selected.initial}
      animate={selected.animate}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
    >
      {children}
    </m.div>
  );
}
