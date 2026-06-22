import React from "react";
import { cn } from "@/src/lib/utils";

type SectionProps = React.HTMLAttributes<HTMLElement> & {
  id?: string;
  variant?: "default" | "surface" | "alternate" | "transparent";
};

export default function Section({
  id,
  className,
  variant = "default",
  children,
  ...props
}: SectionProps) {
  const variantStyles = {
    default: "bg-background",
    surface:
      "bg-muted/5 border-y border-blue-500/5",
    alternate:
      "bg-linear-to-b from-background to-blue-500/[0.02] border-y border-blue-500/5",
    transparent: "bg-transparent border-0 py-0! px-0!",
  };

  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-24 py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-x-hidden relative",
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
}