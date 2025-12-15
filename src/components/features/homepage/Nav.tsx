"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, LogOut } from "lucide-react";
import { authClient } from "@/src/lib/auth-client";
import Image from "next/image";
import ThemeToggle from "@/src/components/shared/ThemeToggle";
import LanguageSwitcher from "@/src/components/i18n/LanguageSwitcher";
import { useTheme } from "next-themes";
import LogoLight from "@/public/Logo-Blue-Dot.png";
import LogoDark from "@/public/Logo-Blue-Dot.png";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/src/components/ui/button";
import { SignOutButton } from "@/src/components/features/auth/SignOutButton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/src/components/ui/sheet";
import { cn } from "@/src/lib/utils";

const navLinks = [
  { href: "/", label: "home" },
  { href: "/#projects", label: "projects" },
  { href: "/blogs", label: "blog" },
  { href: "/#certificates", label: "certificates" },
  { href: "/#about", label: "about" },
  { href: "/#contact", label: "contact" },
  { href: "/dashboard", label: "dashboard" },
];

export function Nav({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const { data: session } = authClient.useSession();

  const t = useTranslations("nav");
  const locale = useLocale();
  const isRTL = locale === "ar";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (pathname.includes("dashboard")) return null;

  const Logo = (
    <Link href="/" className="flex items-center gap-2">
      <Image
        src={!mounted || resolvedTheme === "light" ? LogoLight : LogoDark}
        width={40}
        height={40}
        alt="Logo"
        className="object-contain"
      />
      <span className="font-bold text-xl tracking-tight hidden sm:block">
        Ahmed Lotfy
      </span>
    </Link>
  );

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b shadow-sm py-2"
          : "bg-transparent py-4"
      )}
    >
      <nav className="container mx-auto px-4 flex items-center justify-between">
        {Logo}

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Button
              key={link.href}
              variant="ghost"
              asChild
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary hover:bg-primary/10",
                pathname === link.href && "text-primary bg-primary/10"
              )}
            >
              <Link href={`/${locale}${link.href}`}>{t(link.label)}</Link>
            </Button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2 border-s ps-4 ms-4">
          <ThemeToggle />
          <LanguageSwitcher />
          {session && (
            <SignOutButton
              variant="ghost"
              size="icon"
              title="Sign Out"
            >
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Sign out</span>
            </SignOutButton>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <LanguageSwitcher />

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side={isRTL ? "left" : "right"} className="w-[300px] sm:w-[400px]">
              <SheetHeader className="text-left border-b pb-4 mb-4">
                <SheetTitle className="flex items-center gap-2">
                  <Image
                    src={!mounted || resolvedTheme === "light" ? LogoLight : LogoDark}
                    width={32}
                    height={32}
                    alt="Logo"
                  />
                  <span>Ahmed Lotfy</span>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Button
                    key={link.href}
                    variant="ghost"
                    asChild
                    className={cn(
                      "justify-start text-base",
                      pathname === link.href && "text-primary bg-primary/10"
                    )}
                    onClick={() => setOpen(false)}
                  >
                    <Link href={`/${locale}${link.href}`}>
                      {t(link.label)}
                    </Link>
                  </Button>
                ))}
                {session && (
                  <SignOutButton
                    variant="ghost"
                    className="justify-start text-base text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => setOpen(false)}
                  >
                    <LogOut className="h-5 w-5 me-2" />
                    {t("sign_out") || "Sign Out"}
                  </SignOutButton>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
