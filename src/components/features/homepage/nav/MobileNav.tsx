"use client";

import React from "react";
import Link from "next/link";
import { House, FolderOpen, Article, User, EnvelopeSimple } from "@phosphor-icons/react";
import { m } from "motion/react";
import { cn } from "@/src/lib/utils";

import type { NavLink } from "./config";
import { isActiveLink, localizeHref } from "./utils";

type MobileNavProps = {
  activeSection: string | null;
  isRTL: boolean;
  links: NavLink[];
  locale: string;
  normalizedPath: string;
  t: (key: string) => string;
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "/": House,
  "/projects": FolderOpen,
  "/blogs": Article,
  "/about": User,
  "/contact": EnvelopeSimple,
};

export function MobileNav({
  activeSection,
  links,
  locale,
  normalizedPath,
  t,
}: MobileNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Backdrop blur background */}
      <div className="absolute inset-0 bg-black/85 backdrop-blur-xl border-t border-white/[0.08]" />

      <nav className="relative mx-auto max-w-sm px-2 pb-[env(safe-area-inset-bottom,8px)]">
        <div className="flex items-center justify-around h-16">
          {links.map((link) => {
            const active = isActiveLink(link, normalizedPath, activeSection);
            const Icon = iconMap[link.href] || House;
            const href = localizeHref(locale, link.href);

            return (
              <Link
                key={link.href}
                href={href}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-1 w-14 h-14 rounded-xl transition-colors duration-300",
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {active && (
                  <m.div
                    layoutId="bottom-nav-active"
                    className="absolute inset-0 rounded-xl bg-primary/[0.08]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon className={cn("h-5 w-5 relative z-10 transition-transform duration-300 ease-brand", active && "scale-105")} />
                <span className={cn("relative z-10 text-[10px] font-medium", active && "text-primary")}>
                  {t(link.label)}
                </span>
                {active && (
                  <m.div
                    layoutId="bottom-nav-indicator"
                    className="absolute -top-px left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
