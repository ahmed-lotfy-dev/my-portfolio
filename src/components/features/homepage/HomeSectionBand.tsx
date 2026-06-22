import type { ReactNode } from "react";
import { cn } from "@/src/lib/utils";

type HomeSectionBandProps = {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  variant?: "warm" | "editorial" | "deep";
};

const variantClasses = {
  warm: "section-band section-band-warm",
  editorial: "section-band section-band-editorial",
  deep: "section-band section-band-deep",
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
        variantClasses[variant],
        className
      )}
    >
      {/* Subtle top edge line */}
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-border to-transparent" />
      <div className={cn("relative px-6 py-16 md:px-10 md:py-20 lg:px-14 lg:py-24", innerClassName)}>
        {children}
      </div>
    </section>
  );
}
