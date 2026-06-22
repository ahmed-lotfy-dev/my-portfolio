"use client";

import Link from "next/link";
import { FileText, ArrowRight, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/src/components/ui/button";
import { CVDropdown } from "./CVDropdown";
import { Nav } from "./Nav";
import { m } from "motion/react";

export default function Hero() {
  const t = useTranslations("hero");

  return (
    <header className="relative flex w-full flex-col overflow-hidden" id="hero">
      <div className="hero-mesh-bg absolute inset-0 -z-20" />
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />
      </div>
      <div className="absolute inset-0 -z-10 hero-grid-overlay" />
      <div className="hero-bottom-fade" />

      <Nav variant="integrated" />

      <section className="relative flex flex-col items-center justify-center px-5 pt-16 pb-8 md:pt-20 md:pb-10 lg:pt-24 lg:pb-12">
        <div className="container relative z-10 mx-auto max-w-5xl">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-start">
            <m.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="hero-badge-wrapper mb-6 md:mb-8"
            >
              <div className="hero-badge-dot" />
              <span className="text-[11px] font-semibold tracking-wider uppercase">{t("available_work")}</span>
            </m.div>

            <m.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="hero-title"
            >
              <span className="hero-title-line">{t("name")}</span>
              <span className="hero-title-gradient">{t("title")}</span>
            </m.h1>

            <m.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="mt-5 max-w-[520px] text-sm font-normal leading-relaxed text-muted-foreground/75 md:mt-6 md:text-base lg:mx-0"
            >
              {t("description")}
            </m.p>

            <m.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start"
            >
              <Button
                size="lg"
                className="hero-cta-primary group h-12 cursor-pointer overflow-hidden rounded-xl border-none px-6 text-sm font-bold"
                asChild
              >
                <Link href="#contact">
                  <span className="relative z-10 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    {t("book_consultation")}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="hero-cta-secondary h-12 cursor-pointer rounded-xl px-6 text-sm font-semibold"
                asChild
              >
                <Link href="#projects">
                  <span>{t("view_work")}</span>
                </Link>
              </Button>

              <CVDropdown>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 gap-2 rounded-xl px-4 text-muted-foreground/50 transition-colors hover:text-foreground"
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span className="font-semibold text-xs">{t("resume")}</span>
                </Button>
              </CVDropdown>
            </m.div>
          </div>
        </div>
      </section>
    </header>
  );
}