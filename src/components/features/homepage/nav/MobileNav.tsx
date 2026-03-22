"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, LogOut, Menu } from "lucide-react";

import { SignOutButton } from "@/src/components/features/auth/SignOutButton";
import { Button } from "@/src/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
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
          className="h-10 w-10 rounded-full border-primary/10 bg-background/30"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open navigation</span>
        </Button>
      </SheetTrigger>

      <SheetContent
        side={isRTL ? "left" : "right"}
        className="w-[92vw] max-w-sm border-border bg-[linear-gradient(180deg,rgba(29,23,18,0.98),rgba(21,17,14,0.98))] p-0"
      >
        <SheetHeader className="border-b border-primary/10 px-6 py-5 text-left">
          <SheetTitle className="flex items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-[1rem] border border-primary/15 bg-secondary">
              <Image
                src="/as-mark.svg"
                width={24}
                height={24}
                alt="Ahmed Shoman logo"
                className="object-contain"
              />
            </div>
            <span className="font-heading text-lg">Ahmed Shoman</span>
          </SheetTitle>
          <SheetDescription>
            Portfolio navigation and quick actions.
          </SheetDescription>
        </SheetHeader>

        <div className="flex h-full flex-col px-4 pb-6 pt-4">
          <div className="flex flex-col gap-2">
            {links.map((link) => {
              const active = isActiveLink(link, normalizedPath, activeSection);

              return (
                <Button
                  key={link.href}
                  variant="ghost"
                  asChild
                  className={cn(
                    "group h-12 justify-between rounded-[1rem] px-4 text-base transition-all duration-300",
                    active
                      ? "bg-primary text-primary-foreground shadow-[0_16px_40px_-22px_hsl(var(--primary))]"
                      : "text-foreground hover:bg-primary/10 hover:text-primary-light"
                  )}
                  onClick={() => setOpen(false)}
                >
                  <Link href={localizeHref(locale, link.href)}>
                    <span>{t(link.label)}</span>
                    <ArrowUpRight
                      className={cn(
                        "h-4 w-4 transition-transform duration-300",
                        active
                          ? "text-primary-foreground"
                          : "text-muted-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"
                      )}
                    />
                  </Link>
                </Button>
              );
            })}
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-primary/10 bg-background/35 p-4">
            <div className="mb-3">{userSlot}</div>
            {hasSession && (
              <SignOutButton
                variant="ghost"
                className="h-11 w-full justify-start rounded-2xl px-4 text-base text-destructive transition-colors hover:bg-destructive/10 hover:text-destructive"
                onClick={() => setOpen(false)}
              >
                <LogOut className="me-2 h-4 w-4" />
                {t("sign_out") || "Sign Out"}
              </SignOutButton>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
