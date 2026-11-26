"use client";

import Link from "next/link";
import { ArrowDown, ArrowUpRight, DownloadSimple, MapPin } from "@phosphor-icons/react";
import { useTranslations, useLocale } from "next-intl";
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

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

const stack = ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL"];

export default function Hero() {
  const t = useTranslations("hero");
  const locale = useLocale();

  return (
    <header
      className="relative flex min-h-[100dvh] w-full flex-col overflow-hidden border-b border-white/[0.07]"
      id="hero"
    >
      <Nav variant="integrated" />

      <section className="relative flex flex-1 items-center px-6 pb-16 pt-32 md:px-8 md:pt-36 lg:pb-24">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <m.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
              className="mb-8 flex items-start gap-3"
            >
              <span className="relative mt-1 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-primary/40" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              <span className="eyebrow text-foreground/80">{t("available_work")}</span>
            </m.div>

            <m.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.08, ease }}
              className="text-6xl font-semibold leading-[0.95] tracking-[-0.045em] text-foreground sm:text-7xl lg:text-8xl"
            >
              {t("name")}
            </m.h1>

            <m.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.16, ease }}
              className="hero-gradient mt-6 max-w-[680px] text-2xl font-medium leading-tight tracking-[-0.03em] sm:text-3xl lg:text-4xl"
            >
              {t("title")}
            </m.p>

            <m.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.24, ease }}
              className="mt-7 max-w-[62ch] text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              {t("description")}
            </m.p>

            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.32, ease }}
              className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center"
            >
              <Link
                href="/Ahmed-Lotfy-Cv.pdf"
                download
                className="group inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-base font-semibold text-primary-foreground transition-all duration-300 ease-brand hover:bg-primary-light active:translate-y-px"
              >
                <DownloadSimple size={18} weight="bold" />
                {t("cv_modal.download")}
              </Link>

              <Link
                href={`/${locale}/projects`}
                className="group inline-flex items-center gap-2 py-2 text-base font-medium text-foreground/70 transition-colors duration-300 hover:text-foreground"
              >
                {t("view_work")}
                <ArrowUpRight
                  size={18}
                  weight="bold"
                  className="transition-transform duration-300 ease-brand group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </m.div>

            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.44, ease }}
              className="mt-16 grid max-w-lg grid-cols-3 gap-6 border-t border-white/[0.08] pt-6"
            >
              {[
                { value: t("stats.years_value"), label: t("stats.years_label") },
                { value: t("stats.projects_value"), label: t("stats.projects_label") },
                { value: t("stats.score_value"), label: t("stats.score_label") },
              ].map((stat) => (
                <div key={stat.label}>
                  <p dir="ltr" className="tabular text-2xl font-semibold text-foreground rtl:text-right">{stat.value}</p>
                  <p className="mt-1 text-xs leading-snug text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </m.div>
          </div>

          <m.aside
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease }}
            className="lg:col-span-5"
          >
            <div className="surface p-2">
              <div className="rounded-[1.25rem] bg-[#0c0b08] p-6 sm:p-8">
                <div className="flex items-center justify-between">
                  <span className="eyebrow">{t("panel.index")}</span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-primary">
                    {t("panel.open")}
                  </span>
                </div>

                <dl className="mt-8 space-y-5">
                  <div className="flex items-start justify-between gap-6 border-b border-white/[0.07] pb-5">
                    <dt className="text-sm text-muted-foreground">{t("panel.based_in")}</dt>
                    <dd className="flex items-center gap-1.5 text-right text-sm font-medium text-foreground">
                      <MapPin size={14} weight="bold" className="text-primary" />
                      {t("panel.location")}
                    </dd>
                  </div>
                  <div className="flex items-start justify-between gap-6 border-b border-white/[0.07] pb-5">
                    <dt className="text-sm text-muted-foreground">{t("panel.timezone")}</dt>
                    <dd className="tabular text-sm font-medium text-foreground">GMT+2</dd>
                  </div>
                  <div className="flex items-start justify-between gap-6 border-b border-white/[0.07] pb-5">
                    <dt className="text-sm text-muted-foreground">{t("panel.current")}</dt>
                    <dd className="max-w-[16rem] text-right text-sm font-medium leading-snug text-foreground">
                      {t("panel.current_role")}
                    </dd>
                  </div>
                  <div className="flex items-start justify-between gap-6">
                    <dt className="text-sm text-muted-foreground">{t("panel.focus")}</dt>
                    <dd className="text-right text-sm font-medium text-foreground">
                      {t("panel.focus_value")}
                    </dd>
                  </div>
                </dl>

                <div className="mt-8 flex flex-wrap gap-2">
                  {stack.map((item) => (
                    <span
                      key={item}
                      className="rounded-md border border-white/[0.08] px-2 py-1 font-mono text-[11px] tracking-wide text-muted-foreground"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/${locale}/contact`}
                  className="mt-8 flex items-center justify-between border-t border-white/[0.08] pt-5 text-sm font-medium text-foreground transition-colors duration-300 hover:text-primary"
                >
                  {t("start_conversation")}
                  <ArrowUpRight size={16} weight="bold" />
                </Link>
              </div>
            </div>
          </m.aside>
        </div>
      </section>

      <div className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-2 md:flex">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
          {t("scroll")}
        </span>
        <ArrowDown size={12} className="text-muted-foreground/60" />
      </div>
    </header>
  );
}
