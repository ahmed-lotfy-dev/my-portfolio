import React from "react"
import { cn } from "@/src/lib/utils"

type SectionProps = React.HTMLAttributes<HTMLElement> & {
  id?: string
}

export default function Section({
  id,
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-24 py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-x-hidden",
        className
      )}
      {...props}
    >
      {children}
    </section>
  )
}
