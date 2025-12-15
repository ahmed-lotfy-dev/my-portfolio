"use client";

import Link from "next/link";
import { Github, Linkedin, Mail, Award, Home, Briefcase, MessageSquare } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { usePathname } from "next/navigation";

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

  return (
    <footer className="w-full border-t border-border bg-card/50 backdrop-blur-xl mt-20">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground tracking-tight">
              Ahmed Lotfy
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("about_text")}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              {t("quick_links")}
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
                  >
                    <link.icon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              {t("connect")}
            </h3>
            <ul className="space-y-2">
              {socialLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
                    aria-label={link.ariaLabel}
                  >
                    <link.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Additional */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              {t("legal")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`/${locale}/privacy`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("links.privacy")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/terms`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("links.terms")}
                </Link>
              </li>
            </ul>
            <div className="pt-4">
              <p className="text-xs text-muted-foreground">
                {t("built_with")}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-md">
                  Next.js
                </span>
                <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-md">
                  TypeScript
                </span>
                <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-md">
                  Tailwind
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {currentYear} Ahmed Lotfy. {t("rights")}
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-muted/50 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                  aria-label={link.ariaLabel}
                >
                  <link.icon size={18} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
