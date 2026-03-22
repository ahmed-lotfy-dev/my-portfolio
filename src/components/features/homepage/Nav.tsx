"use client";

import React, { useRef, useState, useEffect } from "react";
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
  hidden: { opacity: 0, y: -15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 150,
      damping: 24,
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const navItemVariants: Variants = {
  hidden: { opacity: 0, y: -10, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 180,
      damping: 22,
    },
  },
};

export type NavProps = {
  variant?: "floating" | "integrated";
};

export function Nav({ variant = "floating" }: NavProps) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const t = useTranslations("nav");
  const locale = useLocale();
  const { data: session } = authClient.useSession();
  const normalizedPath = stripLocale(pathname, locale);
  const { activeSection, scrolled } = useNavState(normalizedPath);
  const isRTL = locale === "ar";
  
  const navRef = useRef<HTMLElement>(null);
  const isHomePage = normalizedPath === "" || normalizedPath === "/" || normalizedPath === `/${locale}`;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Hide the global floating nav on the home page
  if (isHomePage && variant === "floating") return null;
  if (normalizedPath.startsWith("/dashboard")) return null;

  const isIntegrated = variant === "integrated";

  const mobileVariant: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
        type: "spring",
        stiffness: 150,
        damping: 24,
      }
    }
  };

  const desktopVariant: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
        type: "spring",
        stiffness: 150,
        damping: 24,
      }
    }
  };

  return (
    <m.nav
      ref={navRef}
      className={cn(
        "z-50 w-full transition-all duration-300",
        isIntegrated 
          ? "relative px-2 pt-4 sm:px-4 md:pt-6 lg:px-8" 
          : "fixed left-0 right-0 md:top-0 max-md:bottom-6 max-md:px-4"
      )}
      variants={
        isIntegrated 
          ? navContainerVariants 
          : (mounted && typeof window !== "undefined" && window.innerWidth < 768) 
            ? mobileVariant 
            : desktopVariant
      }
      initial={mounted ? (isIntegrated ? "visible" : "hidden") : "visible"}
      animate={mounted ? "visible" : "visible"}
      suppressHydrationWarning
    >
      <div
        className={cn(
          "container relative mx-auto flex h-16 w-full items-center justify-between transition-all duration-700 md:h-20 px-4 md:px-8 max-w-7xl rounded-[2.5rem]",
          isIntegrated
            ? scrollerLayoutStyles(scrolled)
            : islandLayoutStyles(scrolled),
          // Mobile specific bottom nav tweaks
          !isIntegrated && "max-md:h-14 max-md:rounded-4xl max-md:shadow-2xl max-md:border-primary/20 max-md:bg-black/80 max-md:backdrop-blur-2xl"
        )}
      >
        {/* Top Glow Edge - Desktop/Integrated Only */}
        <div className={cn(
          "absolute inset-x-12 top-0 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent opacity-50 blur-sm",
          !isIntegrated && "max-md:hidden"
        )} />

        {/* Brand - Visible on Desktop, Hidden on Mobile Bottom Nav */}
        <m.div 
          variants={navItemVariants} 
          className={cn(
            "relative z-10 flex flex-1 items-center justify-start",
            !isIntegrated && "max-md:hidden"
          )}
          suppressHydrationWarning
        >
          <NavBrand locale={locale} />
        </m.div>

        {/* Center: Main Navigation (Desktop Only) */}
        <m.div 
          variants={navItemVariants} 
          className="relative z-10 hidden flex-1 items-center justify-center md:flex"
          suppressHydrationWarning
        >
          <DesktopNav
            activeSection={activeSection}
            links={navLinks}
            locale={locale}
            normalizedPath={normalizedPath}
            t={t}
          />
        </m.div>

        {/* Mobile: Centered Action or Brand Mini (Bottom Nav Style) */}
        <m.div
          variants={navItemVariants}
          className={cn(
            "relative z-10 hidden items-center justify-center flex-1",
            !isIntegrated && "max-md:flex"
          )}
        >
          <div className="flex items-center justify-center w-10 h-10 border rounded-xl bg-primary/10 border-primary/20">
            <NavBrand locale={locale} />
          </div>
        </m.div>

        {/* Right Actions / Mobile Menu Toggle */}
        <m.div 
          variants={navItemVariants} 
          className="relative z-10 flex flex-1 items-center justify-end gap-2 sm:gap-4"
          suppressHydrationWarning
        >
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

          <div className="flex items-center gap-3 md:hidden">
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
