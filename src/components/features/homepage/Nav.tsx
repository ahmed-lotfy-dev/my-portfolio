"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { authClient } from "@/src/lib/auth-client";
import LanguageSwitcher from "@/src/components/i18n/LanguageSwitcher";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/src/lib/utils";
import dynamic from "next/dynamic";
import { navLinks } from "./nav/config";
import { DesktopNav } from "./nav/DesktopNav";
import { NavBrand } from "./nav/NavBrand";
import { stripLocale, localizeHref } from "./nav/utils";
import { useNavState } from "./nav/useNavState";
import { m, AnimatePresence, type Variants } from "motion/react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

const UserButton = dynamic(
  () => import("@/src/components/features/dashboard/layout/UserButton"),
  { ssr: false }
);

const navContainerVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const navItemVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
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
  
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  const isHomePage = normalizedPath === "" || normalizedPath === "/" || normalizedPath === `/${locale}`;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

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
          "container relative mx-auto flex h-16 w-full items-center justify-between transition-all duration-500 md:h-18 px-4 md:px-8 max-w-7xl rounded-[2.5rem]",
          isIntegrated
            ? "border border-primary/15 bg-black/20 shadow-[0_32px_80px_-40px_rgba(0,0,0,0.8)] backdrop-blur-md"
            : cn(
                "border px-3",
                scrolled
                  ? "border-primary/20 bg-black/60 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.95)] backdrop-blur-2xl"
                  : "border-primary/10 bg-black/40 shadow-[0_18px_60px_-42px_rgba(0,0,0,0.9)] backdrop-blur-xl"
              )
        )}
      >
        {/* Top Glow Edge - Senior UI/UX Touch */}
        <div className="absolute inset-x-12 top-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent opacity-40" />

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
              "flex h-[3.2rem] items-center gap-2 rounded-[1.6rem] p-1.5 transition-all",
              isIntegrated 
                ? "bg-white/5 backdrop-blur-sm" // More subtle inside the island
                : "border border-primary/10 bg-background/50 shadow-inner backdrop-blur-md"
            )}>
              <LanguageSwitcher />
              <UserButton className="shrink-0" />
            </div>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <LanguageSwitcher />
            <button
              onClick={() => setIsOpen((prev) => !prev)}
              className="inline-flex size-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 transition-all active:scale-90 hover:bg-primary/20"
              aria-label={t("menu")}
            >
              {isOpen ? <X className="size-5 text-primary" /> : <Menu className="size-5 text-primary" />}
            </button>
          </div>
        </m.div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <m.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="container mx-auto mt-2 rounded-3xl border border-primary/20 bg-black/95 p-4 shadow-2xl backdrop-blur-xl md:hidden max-w-6xl"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href.replace("/#", "") || normalizedPath === link.href;
                return (
                  <Link
                    key={link.href}
                    href={localizeHref(locale, link.href)}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "rounded-xl px-4 py-3 text-sm font-bold transition-all",
                      isActive
                        ? "bg-primary/10 text-primary shadow-[0_0_15px_rgba(212,175,55,0.15)]"
                        : "text-muted-foreground hover:bg-white/5 hover:text-white"
                    )}
                  >
                    {t(link.label)}
                  </Link>
                );
              })}
              
              <div className="mt-2 flex items-center justify-between border-t border-white/10 px-2 pb-2 pt-4">
                <span className="text-sm text-muted-foreground">Account</span>
                <UserButton className="shrink-0" />
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </m.nav>
  );
}
