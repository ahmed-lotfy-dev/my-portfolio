"use client";

import React, { useRef } from "react";
import { usePathname } from "next/navigation";
import { authClient } from "@/src/lib/auth-client";
import LanguageSwitcher from "@/src/components/i18n/LanguageSwitcher";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/src/lib/utils";
import dynamic from "next/dynamic";
import { navLinks } from "./nav/config";
import { DesktopNav } from "./nav/DesktopNav";
import { MobileNav } from "./nav/MobileNav";
import { NavBrand } from "./nav/NavBrand";
import { stripLocale } from "./nav/utils";
import { useNavState } from "./nav/useNavState";
import { m, type Variants } from "motion/react";

const UserButton = dynamic(
  () => import("@/src/components/features/dashboard/layout/UserButton"),
  { ssr: false }
);

const navContainerVariants: Variants = {
  hidden: { opacity: 0, y: -50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 20,
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const navItemVariants: Variants = {
  hidden: { opacity: 0, y: -30, filter: "blur(12px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 18,
    },
  },
};

export type NavProps = {
  variant?: "floating" | "integrated";
};

export function Nav({ variant = "floating" }: NavProps) {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const locale = useLocale();
  const { data: session } = authClient.useSession();
  const normalizedPath = stripLocale(pathname, locale);
  const { activeSection, scrolled } = useNavState(normalizedPath);
  const isRTL = locale === "ar";
  
  const navRef = useRef<HTMLElement>(null);
  const isHomePage = normalizedPath === "" || normalizedPath === "/" || normalizedPath === `/${locale}`;

  // Hide the global floating nav on the home page
  if (isHomePage && variant === "floating") return null;
  if (normalizedPath.startsWith("/dashboard")) return null;

  const isIntegrated = variant === "integrated";

  return (
    <m.nav
      ref={navRef}
      className={cn(
        "z-50 px-2 pt-4 sm:px-4 md:pt-6 lg:px-8",
        isIntegrated ? "relative w-full" : "fixed inset-x-0 top-0"
      )}
      variants={navContainerVariants}
      initial={isIntegrated ? "visible" : "hidden"}
      animate="visible"
    >
      <div
        className={cn(
          "container relative mx-auto flex h-16 w-full items-center justify-between transition-all duration-700 md:h-20 px-4 md:px-8 max-w-7xl rounded-[2.5rem]",
          isIntegrated
            ? scrollerLayoutStyles(scrolled)
            : islandLayoutStyles(scrolled)
        )}
      >
        {/* Top Glow Edge - Senior UI/UX Premium Detail */}
        <div className="absolute inset-x-12 top-0 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent opacity-50 blur-sm" />

        {/* Left: Brand */}
        <m.div variants={navItemVariants} className="relative z-10 flex flex-1 items-center justify-start">
          <NavBrand locale={locale} />
        </m.div>

        {/* Center: Main Navigation */}
        <m.div variants={navItemVariants} className="relative z-10 hidden flex-1 items-center justify-center md:flex">
          <DesktopNav
            activeSection={activeSection}
            links={navLinks}
            locale={locale}
            normalizedPath={normalizedPath}
            t={t}
          />
        </m.div>

        {/* Right: Actions */}
        <m.div variants={navItemVariants} className="relative z-10 flex flex-1 items-center justify-end gap-2 sm:gap-4">
          <div className="hidden items-center gap-2 md:flex">
            <div className={cn(
              "flex h-[3.4rem] items-center gap-3 rounded-[1.7rem] p-1.5 transition-all duration-500",
              isIntegrated 
                ? "bg-white/5 backdrop-blur-md border border-white/5" 
                : "border border-primary/10 bg-black/40 shadow-2xl backdrop-blur-xl"
            )}>
              <LanguageSwitcher />
              <div className="h-4 w-px bg-primary/10 mx-1" />
              <UserButton className="shrink-0" />
            </div>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <LanguageSwitcher />
            <MobileNav
              activeSection={activeSection}
              hasSession={!!session}
              isRTL={isRTL}
              links={navLinks}
              locale={locale}
              normalizedPath={normalizedPath}
              t={t}
              userSlot={<UserButton />}
            />
          </div>
        </m.div>
      </div>
    </m.nav>
  );
}

// Utility style functions for cleaner component body
function scrollerLayoutStyles(scrolled: boolean) {
  return cn(
    "border border-primary/15 transition-all duration-500",
    scrolled 
      ? "bg-black/60 shadow-2xl backdrop-blur-2xl px-6" 
      : "bg-black/20 shadow-xl backdrop-blur-md px-4"
  );
}

function islandLayoutStyles(scrolled: boolean) {
  return cn(
    "border px-3 transition-all duration-700",
    scrolled
      ? "border-primary/25 bg-black/80 shadow-[0_32px_100px_-40px_rgba(0,0,0,1)] backdrop-blur-3xl"
      : "border-primary/10 bg-black/40 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.9)] backdrop-blur-xl"
  );
}
