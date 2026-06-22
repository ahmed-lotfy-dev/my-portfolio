"use client";

import Link from "next/link";
import { FileText, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/src/components/ui/button";
import { CVDropdown } from "./CVDropdown";
import { Nav } from "./Nav";
import { m } from "motion/react";

export interface HeroSection {
  id: string;
  pose: "standing" | "sitting" | "typing" | "presenting";
  screenSection: string;
}

export const HERO_SECTIONS: HeroSection[] = [
  { id: "hero-section", pose: "standing", screenSection: "hero" },
  { id: "services-section", pose: "sitting", screenSection: "about" },
  { id: "projects-section", pose: "typing", screenSection: "projects" },
  { id: "contact-section", pose: "presenting", screenSection: "contact" },
];

export default function Hero() {
  const t = useTranslations("hero");

  return (
    <header className="group relative flex min-h-screen w-full flex-col overflow-hidden snap-section" id="hero">
      <div className="hero-mesh-bg absolute inset-0 -z-20" />
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />
      </div>
      <div className="absolute inset-0 -z-10 hero-grid-overlay" />
      <Nav variant="integrated" />

      <section className="relative flex flex-1 items-center px-4 pb-16 pt-8 md:pb-24 md:pt-12 lg:pb-32">
        <div className="container relative z-10 mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex flex-col items-center">
            {/* Text Side */}
            <div className="relative z-20 w-full text-center md:space-y-8 lg:w-full lg:text-start">
              <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="hero-badge-wrapper">
                <div className="hero-badge-dot" />
                <span className="text-sm font-semibold tracking-wider uppercase">{t("available_work")}</span>
              </m.div>

              <m.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="hero-title">
                <span className="hero-title-line">{t("name")}</span>
                <span className="hero-title-gradient">{t("title")}</span>
              </m.h1>

              <m.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="mx-auto max-w-[95%] text-lg font-medium leading-relaxed text-white/60 md:text-xl lg:mx-0 lg:text-2xl">
                {t("description")}
              </m.p>

              <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="mt-8 flex flex-col items-center justify-center gap-4 pt-6 sm:flex-row lg:justify-start">
                <Button size="lg" className="hero-cta-primary group relative h-16 cursor-pointer overflow-hidden rounded-2xl border-none px-10 text-lg font-bold shadow-2xl transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98]" asChild>
                  <Link href="#contact">
                    <span className="relative z-10 flex items-center gap-3">
                      {t("book_consultation")}
                      <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </Link>
                </Button>

                <Button variant="outline" size="lg" className="hero-cta-secondary h-16 cursor-pointer rounded-2xl border border-white/10 bg-white/[0.03] px-10 text-lg font-semibold text-white/80 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98]" asChild>
                  <Link href="/projects"><span>{t("view_work")}</span></Link>
                </Button>

                <div className="flex justify-center pt-2 sm:pt-0">
                  <CVDropdown>
                    <Button variant="ghost" size="sm" className="h-14 gap-2 rounded-2xl px-6 text-white/50 transition-colors hover:text-white/80">
                      <FileText className="h-5 w-5" />
                      <span className="font-bold">{t("resume")}</span>
                    </Button>
                  </CVDropdown>
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
