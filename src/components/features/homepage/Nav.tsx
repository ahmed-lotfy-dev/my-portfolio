"use client";

import React, { useRef, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "@/src/components/i18n/LanguageSwitcher";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/src/lib/utils";
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
    <>
      {/* Top nav bar — desktop always, mobile only non-hero pages */}
      <m.nav
        ref={navRef}
        className={cn(
          "z-50 w-full transition-all duration-300",
          "fixed left-1/2 top-3 z-50 w-[calc(100%-1.5rem)] max-w-5xl -translate-x-1/2 px-0"
        )}
        variants={isIntegrated ? navContainerVariants : desktopVariant}
        initial={mounted ? (isIntegrated ? "visible" : "hidden") : "visible"}
        animate="visible"
        suppressHydrationWarning
      >
        <div
          className={cn(
            "nav-bar relative mx-auto flex h-16 w-full items-center justify-between rounded-2xl border px-4 transition-all duration-500 ease-brand md:h-[4.25rem] md:px-5",
            scrolled
              ? "border-white/[0.12] bg-black/80 backdrop-blur-xl"
              : "border-white/[0.08] bg-black/55 backdrop-blur-lg"
          )}
        >


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
              <div className="flex items-center gap-2 rounded-lg border border-white/[0.08] p-1">
                <LanguageSwitcher />
              </div>
            </div>

            {/* Mobile: language switcher only (bottom nav handles the rest) */}
            <div className="flex items-center md:hidden">
              <LanguageSwitcher />
            </div>
          </m.div>
        </div>
      </m.nav>

      {/* Mobile bottom nav bar — rendered separately, fixed at bottom */}
      <div className="md:hidden">
        <MobileNav
          activeSection={activeSection}
          isRTL={isRTL}
          links={navLinks}
          locale={locale}
          normalizedPath={normalizedPath}
          t={t}
        />
      </div>
    </>
  );
}
