"use client";

import Link from "next/link";
import { FileText, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";
import { CVDropdown } from "./CVDropdown";
import { Nav } from "./Nav";
import { m } from "motion/react";
import Image from "next/image";

export default function Hero() {
  const t = useTranslations("hero");

  return (
    <header className="group relative flex min-h-[100dvh] w-full flex-col overflow-hidden" id="hero">
      {/* Background layers */}
      <div className="hero-mesh-bg absolute inset-0 -z-20" />
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
      </div>
      <div className="absolute inset-0 -z-10 hero-grid-overlay" />

      <Nav variant="integrated" />

      <section className="relative flex flex-1 items-center px-5 pb-20 pt-24 md:px-8 md:pb-28 md:pt-32 lg:pb-36">
        <div className="container relative z-10 mx-auto max-w-6xl">
          <div className="flex flex-col items-center gap-14 lg:flex-row lg:gap-20 lg:items-start">

            {/* Text Side */}
            <div className="relative z-20 w-full text-center lg:w-[58%] lg:text-start">
              {/* Status badge */}
              <m.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                className="hero-badge-wrapper mb-8"
              >
                <div className="hero-badge-dot" />
                <span className="text-xs font-semibold tracking-wider uppercase">{t("available_work")}</span>
              </m.div>

              {/* Name — big, bold, no gradient text */}
              <m.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.08, ease: [0.4, 0, 0.2, 1] }}
                className="hero-title"
              >
                <span className="hero-title-line">{t("name")}</span>
                <span className="hero-title-gradient">{t("title")}</span>
              </m.h1>

              {/* Description — editorial, restrained */}
              <m.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.16, ease: [0.4, 0, 0.2, 1] }}
                className="mx-auto max-w-[540px] text-base font-normal leading-relaxed text-muted-foreground md:text-lg lg:mx-0"
              >
                {t("description")}
              </m.p>

              {/* CTAs */}
              <m.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.24, ease: [0.4, 0, 0.2, 1] }}
                className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start"
              >
                <Button size="lg" className="hero-cta-primary group relative h-14 cursor-pointer overflow-hidden rounded-xl border-none px-8 text-base font-semibold" asChild>
                  <Link href="#contact">
                    <span className="relative z-10 flex items-center gap-2.5">
                      {t("book_consultation")}
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </Button>

                <Button variant="outline" size="lg" className="hero-cta-secondary h-14 cursor-pointer rounded-xl px-8 text-base font-medium" asChild>
                  <Link href="/projects"><span>{t("view_work")}</span></Link>
                </Button>

                <CVDropdown>
                  <Button variant="ghost" size="sm" className="h-12 gap-2 rounded-xl px-5 text-muted-foreground transition-colors hover:text-foreground">
                    <FileText className="h-4 w-4" />
                    <span className="font-semibold text-sm">{t("resume")}</span>
                  </Button>
                </CVDropdown>
              </m.div>
            </div>

            {/* Right side — Logo mark, minimal */}
            <div className="relative flex w-full items-center justify-center lg:w-[42%] lg:justify-end">
              <m.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="relative"
              >
                {/* Subtle glow */}
                <div className="absolute -inset-8 rounded-full bg-primary/5 blur-3xl" />
                <div className="relative w-44 h-44 sm:w-52 sm:h-52 lg:w-60 lg:h-60 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm flex items-center justify-center">
                  <Image
                    src="/as-mark.svg"
                    alt="Ahmed Lotfy"
                    width={160}
                    height={160}
                    className="w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36 opacity-90"
                    priority
                  />
                </div>
              </m.div>
            </div>
          </div>
        </div>
      </section>

      <div className="hero-bottom-fade" />
    </header>
  );
}
