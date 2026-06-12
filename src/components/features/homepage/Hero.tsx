"use client";

import Link from "next/link";
import { FileText, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";
import { CVDropdown } from "./CVDropdown";
import { Nav } from "./Nav";
import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useEffect } from "react";
import { m, AnimatePresence } from "motion/react";
import Avatar from "./hero/Avatar";
import DeskScene from "./hero/DeskScene";
import ComputerScreen from "./hero/ComputerScreen";
import ScrollController from "./hero/ScrollController";
import { usePrefersReducedMotion, useIsMobile } from "@/src/hooks/useMediaQuery";

const AVATAR_POSES: Record<string, "standing" | "sitting" | "typing" | "presenting"> = {
  hero: "standing",
  about: "sitting",
  projects: "typing",
  contact: "presenting",
};

export default function Hero({ locale }: { locale: string }) {
  const t = useTranslations("hero");
  const isRTL = locale === "ar";
  const [activeSection, setActiveSection] = useState(0);
  const [currentPose, setCurrentPose] = useState<"standing" | "sitting" | "typing" | "presenting">("standing");
  const prefersReduced = usePrefersReducedMotion();
  const isMobile = useIsMobile();

  const sections = ["hero", "about", "projects", "contact"];

  useEffect(() => {
    const pose = AVATAR_POSES[sections[activeSection]];
    if (pose) setCurrentPose(pose);
  }, [activeSection]);

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
          <div className={cn("flex flex-col-reverse items-center gap-10 lg:flex-row lg:gap-20", isRTL && "lg:flex-row-reverse")}>
            {/* Text Side */}
            <div className="relative z-20 w-full text-center md:space-y-8 lg:w-[55%] lg:text-start">
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
                      <ArrowRight className={cn("h-5 w-5 transition-transform duration-300 group-hover:translate-x-1", isRTL && "rotate-180 group-hover:-translate-x-1")} />
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

            {/* 3D Avatar Scene */}
            <div className="hero-image-container relative flex w-full items-center justify-center lg:w-[42%]">
              <AnimatePresence mode="wait">
                <m.div key={currentPose} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }} transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }} className="w-full aspect-square max-w-[520px]">
                  {prefersReduced || isMobile ? (
                    <HeroFallback />
                  ) : (
                    <Suspense fallback={<HeroFallback />}>
                      <Canvas camera={{ position: [0, 1.2, 3.5], fov: 45 }} className="w-full h-full" gl={{ antialias: true, alpha: true }} dpr={[1, 2]}>
                        <ambientLight intensity={0.6} />
                        <directionalLight position={[5, 5, 5]} intensity={1.2} />
                        <pointLight position={[-3, 3, -3]} intensity={0.6} color="#6366f1" />
                        <pointLight position={[3, 2, 3]} intensity={0.4} color="#8b5cf6" />
                        <Avatar pose={currentPose} />
                        <DeskScene />
                        <ComputerScreen section={sections[activeSection]} />
                      </Canvas>
                    </Suspense>
                  )}
                </m.div>
              </AnimatePresence>
              <div className="hero-image-glow" />
            </div>
          </div>
        </div>
      </section>

      <ScrollController onSectionChange={setActiveSection} sections={sections} />
      <div className="hero-bottom-fade" />
    </header>
  );
}

function HeroFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-40 h-40 rounded-full bg-white/5 animate-pulse flex items-center justify-center">
        <div className="w-24 h-24 rounded-full bg-white/10 animate-ping" />
      </div>
    </div>
  );
}
