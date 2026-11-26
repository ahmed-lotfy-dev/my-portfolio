import Link from "next/link";
import { useState } from "react";
import { m } from "motion/react";

import { buttonVariants } from "@/src/components/ui/button";
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
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="hidden items-center gap-0.5 md:flex"
      onMouseLeave={() => setHoveredPath(null)}
    >
      {links.map((link) => {
        const active = isActiveLink(link, normalizedPath, activeSection);
        const isHovered = hoveredPath === link.href;

        return (
          <Link
            key={link.href}
            href={localizeHref(locale, link.href)}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "relative h-9 rounded-lg px-3 text-sm font-medium transition-colors duration-300",
              active ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
            onMouseEnter={() => setHoveredPath(link.href)}
          >
            {isHovered && !active && (
              <m.span
                layoutId="nav-hover"
                className="absolute inset-0 rounded-lg bg-white/[0.05]"
                transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
              />
            )}
            <span className="relative z-10">{t(link.label)}</span>
            {active && (
              <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary" />
            )}
          </Link>
        );
      })}
    </m.div>
  );
}
