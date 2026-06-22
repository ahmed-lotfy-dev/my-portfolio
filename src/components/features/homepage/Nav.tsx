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
  hidden: { opacity: 0, y: -8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 28,
      staggerChildren: 0.06,
      delayChildren: 0.15,
    },
  },
};

const navItemVariants: Variants = {
  hidden: { opacity: 0, y: -6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 220,
      damping: 24,
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
    hidden: { opacity: 0, y: -8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.15,
        type: "spring",
        stiffness: 200,
        damping: 28,
      }
    }
  };

  return (
    <>
      {/* Top nav bar */}
      <m.nav
        ref={navRef}
        className={cn(
          "z-50 w-full transition-all duration-300",
          isIntegrated
            ? "relative px-2 pt-4 sm:px-4 md:pt-6 lg:px-8"
            : "fixed left-0 right-0 top-0 pt-3 px-4"
        )}
        variants={isIntegrated ? navContainerVariants : desktopVariant}
        initial={mounted ? (isIntegrated ? "visible" : "hidden") : "visible"}
        animate="visible"
        suppressHydrationWarning
      >
        <div
          className={cn(
            "container relative mx-auto flex h-14 w-full items-center justify-between transition-all duration-500 px-4 md:px-6 max-w-6xl",
            isIntegrated
              ? "rounded-xl border border-border/30 bg-card/30 backdrop-blur-md"
              : "rounded-xl border border-border/20 bg-background/60 backdrop-blur-lg"
          )}
        >
          <m.div
            variants={navItemVariants}
            className="relative z-10 flex flex-1 items-center justify-start"
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
            className="relative z-10 flex flex-1 items-center justify-end gap-2"
            suppressHydrationWarning
          >
            <div className="hidden items-center gap-2 md:flex">
              <LanguageSwitcher />
            </div>
            <div className="flex items-center md:hidden">
              <LanguageSwitcher />
            </div>
          </m.div>
        </div>
      </m.nav>

      {/* Mobile bottom nav */}
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
