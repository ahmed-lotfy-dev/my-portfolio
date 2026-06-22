"use client";

import Link from "next/link";
import { Mail, Award, Home, Briefcase, MessageSquare, ArrowUpRight } from "lucide-react";
import { IoLogoGithub, IoLogoLinkedin } from "react-icons/io5";
import { useTranslations, useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { Separator } from "@/src/components/ui/separator";

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
    { href: "https://github.com/ahmed-lotfy-dev", label: "GitHub", icon: IoLogoGithub },
    { href: "https://linkedin.com/in/ahmed-lotfy-dev", label: "LinkedIn", icon: IoLogoLinkedin },
    { href: "mailto:contact@ahmedlotfy.dev", label: "Email", icon: Mail },
  ];

  return (
    <footer className="relative w-full mt-20 border-t border-border/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            {/* Brand */}
            <div className="md:col-span-5 space-y-4">
              <h3 className="text-lg font-bold text-foreground">Ahmed Lotfy</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                {t("about_text")}
              </p>
              <div className="flex items-center gap-2 pt-1">
                {socialLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg border border-border/40 bg-card/20 text-muted-foreground hover:text-foreground hover:border-primary/20 transition-all duration-300"
                    aria-label={link.label}
                  >
                    <link.icon className="w-4 h-4" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-3 md:col-start-7">
              <h4 className="text-xs font-semibold text-muted-foreground/50 uppercase tracking-widest mb-4">
                {t("quick_links")}
              </h4>
              <ul className="space-y-2.5">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect */}
            <div className="md:col-span-4">
              <h4 className="text-xs font-semibold text-muted-foreground/50 uppercase tracking-widest mb-4">
                {t("connect")}
              </h4>
              <ul className="space-y-2.5">
                {socialLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                    >
                      {link.label}
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <Separator className="bg-border/20" />

        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground/50">
            © {currentYear} Ahmed Lotfy. {t("rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
