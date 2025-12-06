"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  IoHome,
  IoCode,
  IoGrid,
  IoRibbon,
  IoAddCircleSharp,
  IoChevronBack,
  IoChevronForward,
} from "react-icons/io5";
import { cn } from "@/src/lib/utils";
import { useTranslations } from "next-intl";
import UserButton from "./UserButton";
import LanguageSwitcher from "../i18n/LanguageSwitcher";
import ThemeToggle from "../ThemeToggle";
import { useState, useEffect } from "react";

export default function Aside() {
  const pathname = usePathname();
  const t = useTranslations("dashboard.nav");
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsExpanded(false);
      } else {
        setIsExpanded(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const navLinks = [
    { href: "/", icon: IoHome, text: t("home") },
    { href: "/dashboard", icon: IoGrid, text: t("dashboard") },
    { href: "/dashboard/projects", icon: IoCode, text: t("projects") },
    {
      href: "/dashboard/certificates",
      icon: IoRibbon,
      text: t("certificates"),
    },
    { href: "/dashboard/blogs/new", icon: IoAddCircleSharp, text: t("blog") },
  ];

  return (
    <aside
      className={cn(
        "h-screen sticky top-0 flex flex-col border-r border-border bg-card/80 backdrop-blur-xl transition-all duration-300 overflow-visible z-50",
        isExpanded ? "w-[240px]" : "w-[70px]"
      )}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -right-3 top-20 bg-card border border-border text-muted-foreground hover:text-foreground rounded-full p-1.5 shadow-xl hover:bg-muted transition-all z-50"
      >
        {isExpanded ? (
          <IoChevronBack className="w-3 h-3" />
        ) : (
          <IoChevronForward className="w-3 h-3" />
        )}
      </button>

      {/* Logo / Home Link */}
      <div
        className={cn(
          "flex h-16 items-center border-b border-border transition-all duration-300",
          isExpanded ? "px-6 justify-start" : "justify-center"
        )}
      >
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-transform group-hover:scale-105 shrink-0">
            <IoHome className="h-5 w-5" />
          </div>
          <span
            className={cn(
              "font-bold text-lg tracking-tight text-foreground whitespace-nowrap transition-all duration-300",
              !isExpanded && "opacity-0 w-0 hidden"
            )}
          >
            {t("home")}
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-2 space-y-2 custom-scrollbar">
        <nav className="grid gap-2">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative group block"
                title={!isExpanded ? link.text : undefined}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 rounded-xl bg-primary/10 border border-primary/20 shadow-[0_0_20px_-5px_rgba(var(--primary),0.3)]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
                <div
                  className={cn(
                    "relative flex items-center gap-3 rounded-xl py-3 text-sm font-medium transition-colors",
                    isExpanded ? "px-4 justify-start" : "justify-center px-0",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <link.icon
                    className={cn(
                      "h-5 w-5 shrink-0 transition-transform group-hover:scale-110",
                      isActive && "animate-pulse"
                    )}
                  />
                  <span
                    className={cn(
                      "whitespace-nowrap transition-all duration-300",
                      !isExpanded && "opacity-0 w-0 hidden"
                    )}
                  >
                    {link.text}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / User Controls */}
      <div className="p-2 md:p-4 border-t border-border space-y-4">
        <div
          className={cn(
            "flex gap-2 transition-all duration-300",
            isExpanded
              ? "flex-row items-center justify-between"
              : "flex-col-reverse items-center justify-center gap-4"
          )}
        >
          <div className={cn("flex items-center", isExpanded ? "mr-auto" : "")}>
            <UserButton />
          </div>

          <div
            className={cn(
              "flex items-center gap-2",
              isExpanded ? "" : "flex-col"
            )}
          >
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </aside>
  );
}
