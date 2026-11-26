"use client";

import Link from "next/link";
import { Article, EnvelopeSimple, FolderOpen, GithubLogo, House, LinkedinLogo } from "@phosphor-icons/react";
import { useTranslations, useLocale } from "next-intl";
import { usePathname } from "next/navigation";

export default function Footer() {
  const t = useTranslations("footer");
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();
  const locale = useLocale();

  if (pathname?.includes("/dashboard")) return null;

  const quickLinks = [
    { href: `/${locale}`, label: t("links.home"), icon: House },
    { href: `/${locale}/projects`, label: t("links.projects"), icon: FolderOpen },
    { href: `/${locale}/certificates`, label: t("links.certificates"), icon: Article },
    { href: `/${locale}/blogs`, label: t("links.blog"), icon: Article },
  ];

  const socialLinks = [
    {
      href: "https://github.com/ahmed-lotfy-dev",
      label: "GitHub",
      icon: GithubLogo,
      ariaLabel: "GitHub Profile",
    },
    {
      href: "https://linkedin.com/in/ahmed-lotfy-dev",
      label: "LinkedIn",
      icon: LinkedinLogo,
      ariaLabel: "LinkedIn Profile",
    },
    {
      href: "mailto:contact@alotfy.site",
      label: "Email",
      icon: EnvelopeSimple,
      ariaLabel: "Email Contact",
    },
  ];

  const techStack = ["Next.js", "TypeScript", "Tailwind CSS", "Drizzle ORM"];

  return (
    <footer className="w-full px-6 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-12 py-16 md:grid-cols-12 md:py-20">
          <div className="space-y-6 md:col-span-6">
            <div>
              <h3 className="text-2xl font-semibold tracking-[-0.03em] text-foreground">
                {locale === "ar" ? "أحمد لطفي" : "Ahmed Lotfy"}
              </h3>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
                {t("about_text")}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {socialLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] text-muted-foreground transition-colors duration-300 hover:border-white/[0.16] hover:text-foreground"
                  aria-label={link.ariaLabel}
                >
                  <link.icon size={16} />
                </Link>
              ))}
            </div>
          </div>

          <nav className="space-y-4 md:col-span-3" aria-label="Quick links">
            <h4 className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              {t("quick_links")}
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-foreground/70 transition-colors duration-300 hover:text-foreground"
                  >
                    <link.icon
                      size={14}
                      className="text-muted-foreground transition-colors duration-300 group-hover:text-primary"
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="space-y-4 md:col-span-3" aria-label="Connect and legal">
            <h4 className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              {t("connect")}
            </h4>
            <ul className="space-y-3">
              {socialLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-foreground/70 transition-colors duration-300 hover:text-foreground"
                    aria-label={link.ariaLabel}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="pt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              {t("legal")}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href={`/${locale}/privacy`}
                  className="text-sm text-foreground/70 transition-colors duration-300 hover:text-foreground"
                >
                  {t("links.privacy")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/terms`}
                  className="text-sm text-foreground/70 transition-colors duration-300 hover:text-foreground"
                >
                  {t("links.terms")}
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 border-t border-white/[0.07] py-6 md:flex-row md:items-center">
          <p className="text-xs text-muted-foreground">
            © {currentYear} Ahmed Lotfy. {t("rights")}
          </p>
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {techStack.map((tech) => (
              <li key={tech} className="font-mono text-[11px] tracking-wide text-muted-foreground/70">
                {tech}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
