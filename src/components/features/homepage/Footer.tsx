"use client";

import Link from "next/link";
import { Github, Linkedin, Mail, Award, Home, Briefcase, MessageSquare, ArrowUpRight, Heart } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { Separator } from "@/src/components/ui/separator";
import { Badge } from "@/src/components/ui/badge";

export default function Footer() {
  const t = useTranslations("footer");
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();
  const locale = useLocale();

  if (pathname?.includes("/dashboard")) return null;

  const quickLinks = [
    { href: `/${locale}`, label: t("links.home"), icon: Home },
    { href: `/${locale}#projects`, label: t("links.projects"), icon: Briefcase },
    { href: `/${locale}/certificates`, label: t("links.certificates"), icon: Award },
    { href: `/${locale}#contact`, label: t("links.contact"), icon: MessageSquare },
  ];

  const socialLinks = [
    {
      href: "https://github.com/ahmed-lotfy-dev",
      label: "GitHub",
      icon: Github,
      ariaLabel: "GitHub Profile",
    },
    {
      href: "https://linkedin.com/in/ahmed-lotfy-dev",
      label: "LinkedIn",
      icon: Linkedin,
      ariaLabel: "LinkedIn Profile",
    },
    {
      href: "mailto:contact@ahmedlotfy.dev",
      label: "Email",
      icon: Mail,
      ariaLabel: "Email Contact",
    },
  ];

  const techStack = ["Next.js 16", "TypeScript", "Tailwind CSS", "Drizzle ORM"];

  return (
    <footer className="relative w-full border-t border-border/40 bg-linear-to-b from-background via-background to-muted/20 mt-32">
      {/* Decorative gradient */}
      <div className="absolute inset-0 bg-linear-to-b from-primary/2 to-transparent pointer-events-none" />

      <div className="container relative mx-auto px-4 md:px-6">
        {/* Main Footer Content */}
        <div className="py-16 md:py-20">
          {/* 4-Column Grid on desktop, stacks on mobile/tablet */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 lg:gap-12">
            {/* Brand Section - Spans 2 columns on large screens */}
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-4">
                <h3 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                  Ahmed Lotfy
                </h3>
                <p className="text-base text-muted-foreground leading-relaxed max-w-md">
                  {t("about_text")}
                </p>
              </div>

              {/* Social Links - Large Buttons */}
              <div className="flex items-center gap-3 pt-2">
                {socialLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative p-3 rounded-xl bg-muted/50 hover:bg-primary/10 border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
                    aria-label={link.ariaLabel}
                  >
                    <link.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="absolute inset-0 rounded-xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-5">
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                {t("quick_links")}
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.href} className="">
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-2.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <link.icon className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                      <span className="relative">
                        {link.label}
                        <span className="absolute left-0 bottom-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect + Legal Combined */}
            <div className="space-y-8">
              {/* Connect Section */}
              <div className="space-y-5">
                <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                  {t("connect")}
                </h4>
                <ul className="space-y-3">
                  {socialLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                        aria-label={link.ariaLabel}
                      >
                        <span className="relative">
                          {link.label}
                          <span className="absolute left-0 bottom-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
                        </span>
                        <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Legal Section */}
              <div className="space-y-5">
                <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                  {t("legal")}
                </h4>
                <ul className="space-y-3">
                  <li>
                    <Link
                      href={`/${locale}/privacy`}
                      className="group inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <span className="relative">
                        {t("links.privacy")}
                        <span className="absolute left-0 bottom-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`/${locale}/terms`}
                      className="group inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <span className="relative">
                        {t("links.terms")}
                        <span className="absolute left-0 bottom-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
                      </span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-border/50" />

        {/* Bottom Bar */}
        <div className="py-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Copyright */}
            <div className="flex flex-col md:flex-row items-center gap-2 text-sm text-muted-foreground">
              <p>© {currentYear} Ahmed Lotfy.</p>
              <span className="hidden md:inline">•</span>
              <p className="flex items-center gap-1.5">
                {t("rights")}
                <span className="inline-flex items-center gap-1">
                  Built with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 animate-pulse" /> using
                </span>
              </p>
            </div>

            {/* Tech Stack Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {techStack.map((tech) => (
                <Badge
                  key={tech}
                  variant="secondary"
                  className="px-3 py-1 text-xs font-medium bg-primary/5 hover:bg-primary/10 text-foreground border border-primary/10 transition-colors"
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Subtle bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent" />
    </footer>
  );
}
