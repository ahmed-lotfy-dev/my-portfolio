import type { ReactNode } from "react";
import { cn } from "@/src/lib/utils";

type HomeSectionBandProps = {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  variant?: "warm" | "editorial" | "deep";
};

const variantClasses = {
  warm: "border-blue-500/8 bg-gradient-to-b from-blue-500/[0.02] to-transparent",
  editorial: "border-blue-500/8 bg-gradient-to-b from-transparent via-blue-500/[0.015] to-blue-500/[0.02]",
  deep: "border-blue-500/10 bg-gradient-to-b from-blue-500/[0.03] to-background/60",
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
        "relative isolate overflow-hidden rounded-3xl border",
        variantClasses[variant],
        className,
      )}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/15 to-transparent" />
      <div
        className={cn(
          "relative px-6 py-16 md:px-10 md:py-20 lg:px-14 lg:py-24 space-y-24 sm:space-y-32",
          innerClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
}