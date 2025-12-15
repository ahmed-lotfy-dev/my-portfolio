"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface BackButtonProps {
  href: string;
  label: string;
  locale?: string;
  isSticky?: boolean;
  className?: string;
}

/**
 * Reusable BackButton component used across different pages
 * Supports RTL for Arabic locale and optional sticky positioning
 */
export function BackButton({
  href,
  label,
  locale,
  isSticky = false,
  className
}: BackButtonProps) {
  const isArabic = locale === "ar";

  return (
    <div className={cn("mb-8 md:mb-12", className)}>
      <Link
        href={href}
        className="inline-flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group"
      >
        <div className="p-2.5 rounded-full bg-secondary/50 group-hover:bg-primary/10 transition-colors border border-border/50">
          <ArrowLeft
            className={cn(
              "w-5 h-5 transition-transform",
              isArabic
                ? "scale-x-[-1] group-hover:translate-x-1"
                : "group-hover:-translate-x-1"
            )}
          />
        </div>
        <span className="font-medium text-lg">{label}</span>
      </Link>
    </div>
  );
}
