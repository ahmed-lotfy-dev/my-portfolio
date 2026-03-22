"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, LogOut, Menu, X } from "lucide-react";
import { m, AnimatePresence } from "motion/react";

import { SignOutButton } from "@/src/components/features/auth/SignOutButton";
import { Button } from "@/src/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/src/components/ui/sheet";
import { cn } from "@/src/lib/utils";

import type { NavLink } from "./config";
import { isActiveLink, localizeHref } from "./utils";

type MobileNavProps = {
  activeSection: string | null;
  hasSession: boolean;
  isRTL: boolean;
  links: NavLink[];
  locale: string;
  normalizedPath: string;
  t: (key: string) => string;
  userSlot: React.ReactNode;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { 
      type: "spring" as const, 
      stiffness: 260, 
      damping: 20 
    },
  },
};

export function MobileNav({
  activeSection,
  hasSession,
  isRTL,
  links,
  locale,
  normalizedPath,
  t,
  userSlot,
}: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full border-primary/15 bg-background/40 shadow-xl backdrop-blur-xl transition-all active:scale-95"
        >
          <Menu className="h-5 w-5 text-primary" />
          <span className="sr-only">Open navigation</span>
        </Button>
      </SheetTrigger>

      <SheetContent
        side={isRTL ? "left" : "right"}
        className="w-[92vw] max-w-sm border-l border-primary/10 bg-[linear-gradient(180deg,rgba(15,12,10,0.98),rgba(10,8,7,0.98))] p-0 shadow-2xl backdrop-blur-3xl [&>button]:hidden"
      >
        <div className="flex flex-col h-full overflow-hidden">
          <SheetHeader className="relative border-b border-primary/10 px-6 py-6 text-left">
            <div className="flex items-center justify-between">
              <SheetTitle className="flex items-center gap-3">
                <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/15 bg-black/40 shadow-inner">
                  <Image
                    src="/as-mark.svg"
                    width={26}
                    height={26}
                    alt="Ahmed Shoman logo"
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-heading text-lg font-black tracking-tight text-white leading-tight">Ahmed Shoman</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary/70">Pro Portfolio</span>
                </div>
              </SheetTitle>
              <SheetClose className="rounded-full bg-primary/10 p-2 text-primary hover:bg-primary/20 transition-colors">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </SheetClose>
            </div>
            <SheetDescription className="mt-2 text-xs font-medium text-muted-foreground/60 italic">
              Experience modern digital architecture.
            </SheetDescription>
          </SheetHeader>

          <m.div 
            className="flex flex-1 flex-col px-4 pb-8 pt-6"
            variants={containerVariants}
            initial="hidden"
            animate={open ? "visible" : "hidden"}
            suppressHydrationWarning
          >
            <div className="flex flex-col gap-2">
              {links.map((link) => {
                const active = isActiveLink(link, normalizedPath, activeSection);

                return (
                  <m.div key={link.href} variants={itemVariants}>
                    <Button
                      variant="ghost"
                      asChild
                      className={cn(
                        "group relative h-14 w-full justify-between overflow-hidden rounded-[1.25rem] px-5 text-base font-semibold transition-all duration-500",
                        active
                          ? "bg-primary/10 text-primary shadow-inner"
                          : "text-muted-foreground hover:bg-white/5 hover:text-white"
                      )}
                      onClick={() => setOpen(false)}
                      // @ts-ignore - spring feedback
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link href={localizeHref(locale, link.href)}>
                        <span className="relative z-10 flex items-center gap-3">
                          {active && (
                            <m.span 
                              layoutId="mobile-active-dot"
                              className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]"
                            />
                          )}
                          {t(link.label)}
                        </span>
                        
                        <ArrowUpRight
                          className={cn(
                            "h-5 w-5 transition-all duration-500",
                            active
                              ? "translate-x-0 translate-y-0 opacity-100 text-primary"
                              : "translate-x-2 -translate-y-2 opacity-0 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 group-hover:text-primary"
                          )}
                        />

                        {active && (
                          <m.div
                            layoutId="mobile-active-bg"
                            className="absolute inset-0 z-0 bg-primary/5 blur-xl"
                            suppressHydrationWarning
                          />
                        )}
                      </Link>
                    </Button>
                  </m.div>
                );
              })}
            </div>

            <div className="mt-auto">
              <div className="rounded-[1.75rem] border border-primary/10 bg-black/40 p-4 shadow-xl backdrop-blur-md">
                <div className="mb-4">{userSlot}</div>
                {hasSession && (
                  <SignOutButton
                    variant="ghost"
                    className="h-12 w-full justify-start rounded-2xl px-5 text-base font-bold text-destructive/80 transition-all hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => setOpen(false)}
                  >
                    <LogOut className="me-3 h-5 w-5" />
                    {t("sign_out") || "Sign Out"}
                  </SignOutButton>
                )}
              </div>
            </div>
          </m.div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
