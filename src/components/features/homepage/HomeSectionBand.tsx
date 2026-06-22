import type { ReactNode } from "react";
import { cn } from "@/src/lib/utils";

type HomeSectionBandProps = {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  variant?: "warm" | "editorial" | "deep";
};

const variantClasses = {
  warm: "border-border/25 bg-gradient-to-b from-card/10 to-transparent",
  editorial: "border-border/20 bg-gradient-to-b from-transparent to-card/5",
  deep: "border-border/30 bg-gradient-to-b from-card/15 to-background/50",
};

export function HomeSectionBand({
  children,
  className,
  innerClassName,
  variant = "warm",
}: HomeSectionBandProps) {
  return (
    <section className={cn("relative isolate overflow-hidden rounded-3xl border", variantClasses[variant], className)}>
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border/40 to-transparent" />
      <div className={cn("relative px-6 py-16 md:px-10 md:py-20 lg:px-14 lg:py-24", innerClassName)}>
        {children}
      </div>
    </section>
  );
}
