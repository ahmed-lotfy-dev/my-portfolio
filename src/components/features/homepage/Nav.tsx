"use client";

import React, { useRef, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
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
  const normalizedPath = stripLocale(pathname, locale);
  const { activeSection, scrolled } = useNavState(normalizedPath);
  const isRTL = locale === "ar";

  const navRef = useRef<HTMLElement>(null);
  const isHomePage = normalizedPath === "" || normalizedPath === "/" || normalizedPath === `/${locale}`;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (isHomePage && variant === "floating") return null;

  const isIntegrated = variant === "integrated";

  const mobileVariant: Variants = {
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
          : "fixed left-0 right-0 top-0 pt-4 max-md:pt-2 px-4"
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
          "nav-bar container relative mx-auto flex h-16 w-full items-center justify-between transition-all duration-700 md:h-20 px-4 md:px-8 max-w-7xl rounded-[2.5rem]",
          isIntegrated
            ? scrollerLayoutStyles(scrolled)
            : islandLayoutStyles(scrolled)
        )}
      >
        <div className={cn(
          "absolute inset-x-12 top-0 h-px bg-linear-to-r from-transparent via-blue-400/30 to-transparent opacity-50 blur-sm"
        )} />

        <m.div
          variants={navItemVariants}
          className={cn("relative z-10 flex flex-1 items-center justify-start")}
          suppressHydrationWarning
        >
          <NavBrand locale={locale} />
        </m.div>

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

        <m.div
          variants={navItemVariants}
          className="relative z-10 flex flex-1 items-center justify-end gap-2 sm:gap-4"
          suppressHydrationWarning
        >
          <div className="hidden items-center gap-2 md:flex">
            <div className={cn(
              "flex h-[3.4rem] items-center gap-3 rounded-[1.7rem] p-1.5 transition-all duration-500 nav-actions-bar",
              isIntegrated
                ? "bg-blue-950/20 backdrop-blur-md border border-blue-400/10"
                : "border border-blue-400/10 bg-slate-950/50 shadow-2xl backdrop-blur-xl"
            )}>
              <LanguageSwitcher />
            </div>
          </div>

          <div className="flex items-center gap-3 md:hidden">
            <LanguageSwitcher />
            <MobileNav
              activeSection={activeSection}
              isRTL={isRTL}
              links={navLinks}
              locale={locale}
              normalizedPath={normalizedPath}
              t={t}
            />
          </div>
        </m.div>
      </div>
    </m.nav>
  );
}

function scrollerLayoutStyles(scrolled: boolean) {
  return cn(
    "border transition-all duration-500",
    scrolled
      ? "nav-bar-scrolled bg-slate-950/70 shadow-[0_8px_40px_-8px_rgba(59,130,246,0.15)] backdrop-blur-2xl border-blue-400/20 px-6"
      : "bg-slate-950/20 shadow-xl backdrop-blur-md border-blue-400/10 px-4"
  );
}

function islandLayoutStyles(scrolled: boolean) {
  return cn(
    "border px-3 transition-all duration-700",
    scrolled
      ? "nav-bar-scrolled border-blue-400/25 bg-slate-950/80 shadow-[0_32px_100px_-40px_rgba(0,0,0,1),0_0_30px_-10px_rgba(59,130,246,0.15)] backdrop-blur-3xl"
      : "border-blue-400/10 bg-slate-950/40 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.9)] backdrop-blur-xl"
  );
}
