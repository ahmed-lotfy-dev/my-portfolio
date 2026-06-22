"use client";

import Link from "next/link";
import { Mail, Award, Home, Briefcase, MessageSquare, ArrowUpRight, Heart } from "lucide-react";
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

  const techStack = ["Next.js", "TypeScript", "Tailwind CSS", "Drizzle ORM"];

  return (
    <footer className="relative w-full mt-24 border-t border-border/20">
      {/* Top glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="container mx-auto px-4 md:px-6">
        <div className="py-14 md:py-18">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
            {/* Brand */}
            <div className="lg:col-span-2 space-y-5">
              <h3 className="text-xl font-bold text-foreground">Ahmed Lotfy</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                {t("about_text")}
              </p>
              <div className="flex items-center gap-2.5 pt-1">
                {socialLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg border border-border/30 bg-card/20 text-muted-foreground hover:text-foreground hover:border-primary/25 hover:bg-primary/5 transition-all duration-300"
                    aria-label={link.label}
                  >
                    <link.icon className="w-4 h-4" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <nav className="space-y-4" aria-label="Quick links">
              <h4 className="text-xs font-bold text-muted-foreground/40 uppercase tracking-widest">
                {t("quick_links")}
              </h4>
              <ul className="space-y-2.5">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center gap-2">
                      <link.icon className="w-3.5 h-3.5 opacity-50" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Connect + Legal */}
            <div className="space-y-6">
              <nav className="space-y-4" aria-label="Connect">
                <h4 className="text-xs font-bold text-muted-foreground/40 uppercase tracking-widest">
                  {t("connect")}
                </h4>
                <ul className="space-y-2.5">
                  {socialLinks.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
                        {link.label}
                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <nav className="space-y-4" aria-label="Legal">
                <h4 className="text-xs font-bold text-muted-foreground/40 uppercase tracking-widest">
                  {t("legal")}
                </h4>
                <ul className="space-y-2.5">
                  <li><Link href={`/${locale}/privacy`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("links.privacy")}</Link></li>
                  <li><Link href={`/${locale}/terms`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("links.terms")}</Link></li>
                </ul>
              </nav>
            </div>
          </div>
        </div>

        <Separator className="bg-border/15" />

        <div className="py-6 flex flex-col lg:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground/40">
            © {currentYear} Ahmed Lotfy. {t("rights")}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {techStack.map((tech) => (
              <span key={tech} className="px-2.5 py-1 text-[10px] font-medium text-muted-foreground/30 bg-muted/20 rounded-md border border-border/15">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
