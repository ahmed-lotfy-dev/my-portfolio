import Link from "next/link";
import { useState } from "react";
import { m, AnimatePresence } from "motion/react";

import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";

import type { NavLink } from "./config";
import { isActiveLink, localizeHref } from "./utils";

type DesktopNavProps = {
  activeSection: string | null;
  links: NavLink[];
  locale: string;
  normalizedPath: string;
  t: (key: string) => string;
};

export function DesktopNav({
  activeSection,
  links,
  locale,
  normalizedPath,
  t,
}: DesktopNavProps) {
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  return (
    <div 
      className="hidden items-center gap-1 rounded-full border border-primary/10 bg-background/30 p-1 backdrop-blur-md md:flex"
      onMouseLeave={() => setHoveredPath(null)}
    >
      {links.map((link) => {
        const active = isActiveLink(link, normalizedPath, activeSection);
        const isHovered = hoveredPath === link.href;

        return (
          <Button
            key={link.href}
            variant="ghost"
            asChild
            className={cn(
              "group relative h-9 px-4 text-sm font-medium transition-colors duration-300 rounded-full",
              active ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
            onMouseEnter={() => setHoveredPath(link.href)}
          >
            <Link href={localizeHref(locale, link.href)}>
              {/* Shared Hover Pill */}
              {isHovered && (
                <m.div
                  layoutId="nav-pill"
                  className="absolute inset-0 z-0 rounded-full bg-primary/10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}

              {/* Active Bloom Indicator */}
              {active && (
                <m.div
                  layoutId="active-indicator"
                  className="absolute -bottom-[2px] left-1/2 h-[2px] w-4 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_12px_rgba(212,175,55,0.8)]"
                  transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
                />
              )}

              <span className="relative z-10">{t(link.label)}</span>
              
              {/* Premium Active Glow Bloom */}
              <AnimatePresence>
                {active && (
                  <m.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute inset-0 z-0 rounded-full bg-primary/5 blur-sm"
                  />
                )}
              </AnimatePresence>
            </Link>
          </Button>
        );
      })}
    </div>
  );
}
