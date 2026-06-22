"use client";

import React from "react";
import Link from "next/link";
import { Home, Briefcase, MessageSquare, User, Mail } from "lucide-react";
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

const iconMap: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  "/": Home,
  "/projects": Briefcase,
  "/blogs": MessageSquare,
  "/about": User,
  "/contact": Mail,
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
      <div className="absolute inset-0 bg-background/80 backdrop-blur-xl border-t border-blue-500/10" />

      <nav className="relative mx-auto max-w-sm px-2 pb-[env(safe-area-inset-bottom,8px)]">
        <div className="flex items-center justify-around h-16">
          {links.map((link) => {
            const active = isActiveLink(link, normalizedPath, activeSection);
            const Icon = iconMap[link.href] || Home;
            const href = localizeHref(locale, link.href);

            return (
              <Link
                key={link.href}
                href={href}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-1 w-14 h-14 rounded-2xl transition-all duration-300",
                  active
                    ? "text-blue-400"
                    : "text-muted-foreground/60 hover:text-muted-foreground",
                )}
              >
                {active && (
                  <m.div
                    layoutId="bottom-nav-active"
                    className="absolute inset-0 rounded-2xl bg-blue-500/10"
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}
                <Icon
                  className={cn(
                    "w-5 h-5 relative z-10 transition-transform duration-300",
                    active && "scale-110",
                  )}
                />
                <span
                  className={cn(
                    "text-[10px] font-semibold relative z-10",
                    active && "text-blue-400",
                  )}
                >
                  {t(link.label)}
                </span>
                {active && (
                  <m.div
                    layoutId="bottom-nav-indicator"
                    className="absolute -top-px left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
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