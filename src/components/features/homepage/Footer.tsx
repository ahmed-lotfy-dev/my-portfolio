"use client";

import Link from "next/link";
import { Mail, Award, Home, Briefcase, MessageSquare, ArrowUpRight } from "lucide-react";
import { IoLogoGithub, IoLogoLinkedin } from "react-icons/io5";
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
    { href: `/${locale}/projects`, label: t("links.projects"), icon: Briefcase },
    { href: `/${locale}/certificates`, label: t("links.certificates"), icon: Award },
    { href: `/${locale}/blogs`, label: t("links.blog"), icon: MessageSquare },
  ];

  const socialLinks = [
    {
      href: "https://github.com/ahmed-lotfy-dev",
      label: "GitHub",
      icon: IoLogoGithub,
      ariaLabel: "GitHub Profile",
    },
    {
      href: "https://linkedin.com/in/ahmed-lotfy-dev",
      label: "LinkedIn",
      icon: IoLogoLinkedin,
      ariaLabel: "LinkedIn Profile",
    },
    {
      href: "mailto:contact@ahmedlotfy.dev",
      label: "Email",
      icon: Mail,
      ariaLabel: "Email Contact",
    },
  ];

  const techStack = ["Next.js", "TypeScript", "Tailwind CSS", "Drizzle ORM"];

  return (
    <footer className="relative w-full mt-32">
      {/* Mesh background using project theme */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-linear-to-b from-background via-background to-primary/5" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_-20%,rgba(59,130,246,0.06),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_30%_at_0%_50%,rgba(99,102,241,0.04),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_30%_at_100%_50%,rgba(59,130,246,0.03),transparent_60%)]" />
      </div>
      {/* Top border glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />
      {/* Decorative gradient */}
      <div className="absolute inset-0 bg-linear-to-b from-primary/3 to-transparent pointer-events-none" />

      <div className="container relative mx-auto px-4 md:px-6">
        {/* Main Footer Content */}
        <div className="py-16 md:py-20">
          {/* 4-Column Grid on desktop, stacks on mobile/tablet */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 lg:gap-12">
            {/* Brand Section - Spans 2 columns on large screens */}
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-4">
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight bg-linear-to-r from-foreground via-primary to-primary-light bg-clip-text text-transparent">
                  Ahmed Lotfy
                </h3>
                <p className="text-base text-muted-foreground leading-relaxed max-w-md">
                  {t("about_text")}
                </p>
              </div>

              {/* Social Links - Glassmorphism buttons */}
              <div className="flex items-center gap-3 pt-2">
                {socialLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative p-3 rounded-xl border border-primary/10 bg-primary/5 hover:bg-primary/15 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5"
                    aria-label={link.ariaLabel}
                  >
                    <link.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="absolute inset-0 rounded-xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <nav className="space-y-5" aria-label="Quick links">
              <h4 className="text-sm font-semibold text-primary/80 uppercase tracking-wider">
                {t("quick_links")}
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.href} className="">
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-2.5 text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                    >
                      <link.icon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-primary" />
                      <span className="relative">
                        {link.label}
                        <span className="absolute left-0 bottom-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Connect + Legal Combined */}
            <div className="space-y-8">
              {/* Connect Section */}
              <nav className="space-y-5" aria-label="Connect">
                <h4 className="text-sm font-semibold text-primary/80 uppercase tracking-wider">
                  {t("connect")}
                </h4>
                <ul className="space-y-3">
                  {socialLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                        aria-label={link.ariaLabel}
                      >
                        <span className="relative">
                          {link.label}
                          <span className="absolute left-0 bottom-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
                        </span>
                        <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Legal Section */}
              <nav className="space-y-5" aria-label="Legal">
                <h4 className="text-sm font-semibold text-primary/80 uppercase tracking-wider">
                  {t("legal")}
                </h4>
                <ul className="space-y-3">
                  <li>
                    <Link
                      href={`/${locale}/privacy`}
                      className="group inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
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
                      className="group inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                    >
                      <span className="relative">
                        {t("links.terms")}
                        <span className="absolute left-0 bottom-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
                      </span>
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>

        <Separator className="bg-primary/20" />

        {/* Bottom Bar */}
        <div className="py-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Copyright */}
            <div className="flex flex-col md:flex-row items-center gap-2 text-sm text-muted-foreground">
              <p>© {currentYear} Ahmed Lotfy. {t("rights")}</p>
            </div>

            {/* Tech Stack Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {techStack.map((tech) => (
                <Badge
                  key={tech}
                  variant="secondary"
                  className="px-3 py-1 text-xs font-medium bg-primary/5 hover:bg-primary/15 text-muted-foreground hover:text-primary border border-primary/10 hover:border-primary/25 transition-all duration-300"
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient glow */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent" />
    </footer>
  );
}
