"use client";

import Link from "next/link";
import Image from "next/image";
import HeroImage from "@/public/images/improved_hero_background.png";
import { FileText, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";

export default function Hero() {
  const t = useTranslations("hero");
  const locale = useLocale();
  const isRTL = locale === "ar";

  return (
    <section
      className="relative overflow-hidden bg-background py-20 sm:py-32"
      id="hero"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background opacity-70" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="container relative mx-auto flex flex-col-reverse gap-12 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col gap-6 text-center lg:text-start lg:w-1/2"
        >
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h2 className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium tracking-wide uppercase border border-primary/20 backdrop-blur-sm">
                {t("title")}
              </h2>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-foreground font-main leading-tight"
            >
              {t("name")}
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed"
          >
            {t("description")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-4"
          >
            <Link
              href="/Ahmed-Lotfy-CV.pdf"
              download
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:scale-105 hover:shadow-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <FileText className="h-5 w-5" />
              <span>{t("resume")}</span>
            </Link>
            <Link
              href="#projects"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card/50 backdrop-blur-sm px-8 py-4 text-lg font-semibold text-foreground shadow-sm transition-all hover:bg-muted hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span>{t("view_work")}</span>
              <ArrowRight className={`h-5 w-5 ${isRTL ? "rotate-180" : ""}`} />
            </Link>
          </motion.div>
        </motion.div>

        {/* Image Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative lg:w-1/2 flex justify-center lg:justify-end"
        >
          <div className="relative w-[280px] h-[280px] sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px]">
            <div className="absolute inset-0 rounded-full bg-linear-to-tr from-primary to-secondary blur-3xl opacity-20 animate-pulse" />
            <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-primary/10 bg-card/10 backdrop-blur-sm">
              <Image
                className={`object-cover ${isRTL ? "scale-x-[-1]" : ""}`}
                src={HeroImage}
                priority={true}
                alt={t("illustrationAlt")}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>

            {/* Floating Badge */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute -bottom-6 -left-6 md:bottom-10 md:-left-10 bg-card/80 backdrop-blur-xl border border-border p-4 rounded-2xl shadow-xl flex items-center gap-3"
            >
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
              <span className="font-medium text-sm text-foreground">
                Available for work
              </span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
