import React from "react"
import { cn } from "@/src/lib/utils"

type SectionProps = React.HTMLAttributes<HTMLElement> & {
  id?: string;
  variant?: "default" | "surface" | "alternate";
}

export default function Section({
  id,
  className,
  variant = "default",
  children,
  ...props
}: SectionProps) {
  const variantStyles = {
    default: "bg-background",
    surface: "bg-muted/10 border-y border-border/50",
    alternate: "bg-linear-to-b from-background to-primary/5 border-y border-primary/10",
  }

  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-24 py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-x-hidden relative",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </section>
  )
}
