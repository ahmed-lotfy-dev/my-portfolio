"use client";

import Link from "next/link";
import { Github, Linkedin, Twitter, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

export default function Footer() {
  const t = useTranslations("footer");
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  if (pathname?.includes("/dashboard")) return null;

  return (
    <footer className="w-full border-t border-border bg-card/50 backdrop-blur-xl mt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="text-lg font-bold text-foreground tracking-tight">
              Ahmed Lotfy
            </span>
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {currentYear} {t("rights")}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="https://github.com/ahmed-lotfy-dev"
              target="_blank"
              className="p-2 rounded-full bg-muted/50 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
              aria-label="GitHub Profile"
            >
              <Github size={20} />
            </Link>
            <Link
              href="https://linkedin.com/in/ahmed-lotfy-dev"
              target="_blank"
              className="p-2 rounded-full bg-muted/50 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
              aria-label="LinkedIn Profile"
            >
              <Linkedin size={20} />
            </Link>
            <Link
              href="mailto:contact@ahmedlotfy.dev"
              className="p-2 rounded-full bg-muted/50 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
              aria-label="Email Contact"
            >
              <Mail size={20} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
