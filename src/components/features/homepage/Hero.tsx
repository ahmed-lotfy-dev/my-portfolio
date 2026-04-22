"use client";

import Link from "next/link";
import Image from "next/image";
import HeroImage from "@/public/images/optimized/About-Image.webp";
import { FileText, ArrowRight } from "lucide-react";
import { CVDropdown } from "./CVDropdown";
import { useTranslations } from "next-intl";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";
import { m, useMotionValue, useSpring, AnimatePresence } from "motion/react";
import type { Variants } from "motion/react";
import { Nav } from "./Nav";
import { SeasonalBackground } from "./seasonal/SeasonalBackground";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: -15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

const imageVariants: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0.4,
      duration: 0.35,
      ease: "easeOut",
    },
  },
};


export default function Hero({ locale }: { locale: string }) {
  const t = useTranslations("hero");
  const isRTL = locale === "ar";

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className="group relative flex min-h-screen w-full flex-col overflow-hidden bg-background"
      id="hero"
      onMouseMove={handleMouseMove}
    >
      <SeasonalBackground />

      {/* Integrated Navigation */}
      <Nav variant="integrated" />

      <section
        className="relative flex flex-1 items-center border-b border-border/40 px-4 pb-20 pt-10 md:pt-16"
      >
        <div className="container relative z-10 mx-auto max-w-7xl px-4 md:px-6">
          <m.div
            className={cn("flex flex-col-reverse items-center gap-8 lg:flex-row lg:gap-16", isRTL ? "lg:flex-row-reverse" : "")}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Content Side - Below image on mobile, left on desktop */}
            <m.div
              className="relative z-20 w-full space-y-6 text-center md:space-y-8 lg:w-[55%] lg:text-start"
              variants={containerVariants}
            >
              <m.div
                variants={itemVariants}
                className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 font-semibold tracking-wide text-primary shadow-sm backdrop-blur-md"
              >
                <span className="text-sm font-bold tracking-wide uppercase">{t("available_work")}</span>
              </m.div>

              <m.h1
                variants={itemVariants}
                className="text-balance font-heading text-[clamp(3.5rem,10vw,7.5rem)] font-black leading-[0.9] tracking-tighter text-white drop-shadow-2xl uppercase"
              >
                {t("name")}
              </m.h1>

              <m.p
                variants={itemVariants}
                className="mx-auto max-w-[95%] text-[clamp(1.1rem,1.8vw,1.5rem)] font-medium leading-relaxed text-muted-foreground/80 lg:mx-0"
              >
                {t("description")}
              </m.p>

              <m.div
                variants={itemVariants}
                className="mt-6 flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row lg:justify-start"
              >
                <Button
                  size="lg"
                  className="group relative h-14 cursor-pointer overflow-hidden rounded-2xl border-none bg-primary px-8 font-black text-primary-foreground shadow-2xl shadow-primary/20 transition-all hover:-translate-y-1 hover:bg-primary/90 hover:shadow-primary/40 active:scale-95"
                  asChild
                >
                  <Link href="#contact">
                    <span className="relative z-10 flex items-center gap-2">
                      {t("book_consultation")}
                      <ArrowRight
                        className={cn("h-5 w-5 transition-transform group-hover:translate-x-1", isRTL && "rotate-180 group-hover:-translate-x-1")}
                      />
                    </span>
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="h-14 cursor-pointer rounded-2xl border-primary/20 bg-primary/5 px-8 font-bold text-primary transition-all hover:-translate-y-1 hover:border-primary/40 hover:bg-primary/10 active:scale-95"
                  asChild
                >
                  <Link href="#projects">
                    <span>{t("view_work")}</span>
                  </Link>
                </Button>

                <div className="flex justify-center pt-2 sm:pt-0">
                  <CVDropdown>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-14 gap-2 rounded-2xl px-6 text-muted-foreground transition-colors hover:text-primary"
                    >
                      <FileText className="h-5 w-5" />
                      <span className="font-bold">{t("resume")}</span>
                    </Button>
                  </CVDropdown>
                </div>
              </m.div>
            </m.div>

            {/* Image Side - Above text on mobile, right on desktop */}
            <m.div
              className="relative flex w-full items-center justify-center order-first lg:order-last lg:w-[40%] p-4 lg:p-0"
              variants={imageVariants}
            >
              <div className="relative w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[380px]">
                <div className="absolute -inset-4 rounded-[3rem] bg-linear-to-tr from-primary/30 to-transparent opacity-60 blur-3xl -z-10" />
                <div className="group relative aspect-square w-full overflow-hidden rounded-[2.5rem] border-2 border-white/5 bg-black/10 shadow-2xl">
                  <Image
                    src={HeroImage}
                    alt={t("illustrationAlt")}
                    fill
                    priority
                    loading="eager"
                    fetchPriority="high"
                    className={cn("object-cover transition-transform duration-[2s] ease-out group-hover:scale-105", isRTL && "scale-x-[-1]")}
                    sizes="(max-width: 768px) 80vw, (max-width: 1024px) 50vw, 45vw"
                    placeholder="blur"
                  />
                </div>
              </div>
            </m.div>
          </m.div>
        </div>
      </section>
    </div>
  );
}
