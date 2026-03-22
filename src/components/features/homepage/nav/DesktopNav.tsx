import Link from "next/link";

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

function linkClassName(active: boolean) {
  return cn(
    "group relative inline-flex h-10 items-center justify-center overflow-hidden rounded-full px-4 text-sm font-medium transition-all duration-300 ease-out",
    active
      ? "text-primary shadow-[0_0_15px_rgba(212,175,55,0.15)]"
      : "text-muted-foreground hover:text-primary/90"
  );
}

function LinkLabel({ active, label }: { active: boolean; label: string }) {
  return (
    <>
      {/* Hover Background */}
      <span className="absolute inset-x-2 inset-y-1 rounded-full bg-primary/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      {/* Active Dot / Glow */}
      <span
        className={cn(
          "absolute bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary transition-all duration-300",
          active
            ? "scale-100 opacity-100 shadow-[0_0_8px_rgba(212,175,55,0.8)]"
            : "scale-0 opacity-0"
        )}
      />
      
      <span className="relative z-10">{label}</span>
    </>
  );
}

export function DesktopNav({
  activeSection,
  links,
  locale,
  normalizedPath,
  t,
}: DesktopNavProps) {
  return (
    <div className="hidden items-center gap-1 rounded-full border border-primary/10 bg-background/30 p-1 md:flex">
      {links.map((link) => {
        const active = isActiveLink(link, normalizedPath, activeSection);

        return (
          <Button
            key={link.href}
            variant="ghost"
            asChild
            className={linkClassName(active)}
          >
            <Link href={localizeHref(locale, link.href)}>
              <LinkLabel active={active} label={t(link.label)} />
            </Link>
          </Button>
        );
      })}
    </div>
  );
}
