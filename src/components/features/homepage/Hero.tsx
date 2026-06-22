"use client";

import Link from "next/link";
import { FileText, ArrowRight, Sparkles } from "lucide-react";
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
      {/* Background */}
      <div className="hero-mesh-bg absolute inset-0 -z-20" />
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />
      </div>
      <div className="absolute inset-0 -z-10 hero-grid-overlay" />

      <Nav variant="integrated" />

      <section className="relative flex flex-1 items-center px-5 pb-24 pt-28 md:px-8 md:pb-32 md:pt-36 lg:pb-40">
        <div className="container relative z-10 mx-auto max-w-6xl">
          <div className="flex flex-col items-center gap-16 lg:flex-row lg:gap-20 lg:items-start">

            {/* Text Side */}
            <div className="relative z-20 w-full text-center lg:w-[60%] lg:text-start">
              {/* Badge */}
              <m.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                className="hero-badge-wrapper mb-8"
              >
                <div className="hero-badge-dot" />
                <span className="text-xs font-semibold tracking-wider uppercase">{t("available_work")}</span>
              </m.div>

              {/* Name — massive, bold */}
              <m.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
                className="hero-title"
              >
                <span className="hero-title-line">{t("name")}</span>
                <span className="hero-title-gradient">{t("title")}</span>
              </m.h1>

              {/* Description */}
              <m.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
                className="mx-auto max-w-[560px] text-base font-normal leading-relaxed text-muted-foreground/80 md:text-lg lg:mx-0"
              >
                {t("description")}
              </m.p>

              {/* CTAs */}
              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start"
              >
                <Button size="lg" className="hero-cta-primary group relative h-14 cursor-pointer overflow-hidden rounded-2xl border-none px-8 text-base font-bold" asChild>
                  <Link href="#contact">
                    <span className="relative z-10 flex items-center gap-2.5">
                      <Sparkles className="w-4 h-4" />
                      {t("book_consultation")}
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </Link>
                </Button>

                <Button variant="outline" size="lg" className="hero-cta-secondary h-14 cursor-pointer rounded-2xl px-8 text-base font-semibold" asChild>
                  <Link href="/projects"><span>{t("view_work")}</span></Link>
                </Button>

                <CVDropdown>
                  <Button variant="ghost" size="sm" className="h-12 gap-2 rounded-2xl px-5 text-muted-foreground/60 transition-colors hover:text-foreground">
                    <FileText className="h-4 w-4" />
                    <span className="font-semibold text-sm">{t("resume")}</span>
                  </Button>
                </CVDropdown>
              </m.div>
            </div>

            {/* Right — Logo with glow */}
            <div className="relative flex w-full items-center justify-center lg:w-[40%] lg:justify-end">
              <m.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.35, ease: [0.4, 0, 0.2, 1] }}
                className="relative"
              >
                {/* Glow behind */}
                <div className="absolute -inset-12 rounded-full bg-primary/10 blur-[80px]" />
                <div className="absolute -inset-6 rounded-full bg-secondary/5 blur-[40px]" />
                <div className="relative w-52 h-52 sm:w-60 sm:h-60 lg:w-72 lg:h-72 rounded-3xl border border-primary/15 bg-card/30 backdrop-blur-sm flex items-center justify-center shadow-2xl shadow-primary/10">
                  <Image
                    src="/as-mark.svg"
                    alt="Ahmed Lotfy"
                    width={200}
                    height={200}
                    className="w-36 h-36 sm:w-40 sm:h-40 lg:w-48 lg:h-48"
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
