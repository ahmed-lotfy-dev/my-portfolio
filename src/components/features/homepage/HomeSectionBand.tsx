import type { ReactNode } from "react";

import { cn } from "@/src/lib/utils";

type HomeSectionBandProps = {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  variant?: "hero" | "warm" | "editorial" | "deep";
};

const variantClasses = {
  hero:
    "border-primary/14 bg-[linear-gradient(180deg,rgba(36,28,21,0.98),rgba(19,16,13,0.98))]",
  warm:
    "border-primary/10 bg-[linear-gradient(180deg,rgba(29,23,18,0.96),rgba(18,15,12,0.98))]",
  editorial:
    "border-primary/8 bg-[linear-gradient(180deg,rgba(24,20,17,0.98),rgba(17,14,12,0.98))]",
  deep:
    "border-primary/12 bg-[linear-gradient(180deg,rgba(33,25,19,0.98),rgba(15,13,11,0.99))]",
};

export function HomeSectionBand({
  children,
  className,
  innerClassName,
  variant = "warm",
}: HomeSectionBandProps) {
  return (
    <section
      className={cn(
        "relative isolate overflow-hidden rounded-[2rem] border shadow-[0_28px_90px_-52px_rgba(0,0,0,0.95)]",
        variantClasses[variant],
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[10%] top-0 h-64 w-64 rounded-full bg-primary/10 blur-[110px]" />
        <div className="absolute bottom-0 right-[8%] h-72 w-72 rounded-full bg-primary/8 blur-[140px]" />
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/25 to-transparent" />
      </div>
      <div className={cn("relative", innerClassName)}>{children}</div>
    </section>
  );
}
