"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { StaticImageData } from "next/image";

type Props = {
  myImage: StaticImageData;
  isRTL: boolean;
};

export default function AboutClient({ myImage, isRTL }: Props) {
  const t = useTranslations("about");

  return (
    <section className="relative overflow-hidden py-24 sm:py-32" id="about">
      <div className="absolute top-1/4 -right-20 h-80 w-80 rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 h-80 w-80 rounded-full bg-secondary/5 blur-[100px] pointer-events-none" />

      <div className="container relative mx-auto px-4">
        <div className="flex flex-col items-center gap-16 lg:flex-row lg:gap-20">

          {/* Image */}
          <div className="relative w-full lg:w-5/12">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-r from-primary/10 to-primary/5 opacity-60 blur-2xl" />
            <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-card/20 p-2">
              <Image
                src={myImage}
                width={400}
                height={400}
                quality={75}
                alt="Ahmed Lotfy"
                className={`rounded-xl w-full ${!isRTL ? "-scale-x-100" : ""}`}
              />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-4 -right-2 sm:-bottom-6 sm:-right-4 flex items-center gap-2.5 rounded-xl border border-border/40 bg-card/80 p-3 shadow-xl backdrop-blur-xl">
              <div className="rounded-lg bg-green-500/15 p-2">
                <div className="w-2.5 h-2.5 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)] animate-pulse" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-600 uppercase tracking-wider">Status</p>
                <p className="text-sm font-bold text-foreground">Available for Hire</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="w-full lg:w-7/12">
            <p className="text-xs font-bold tracking-widest uppercase text-primary/70 mb-4">
              {t("title")}
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-foreground mb-8 leading-[1.1]">
              Solving complex problems with{" "}
              <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                elegant engineering
              </span>
            </h2>

            <div className="space-y-5 text-base leading-relaxed text-muted-foreground">
              <p>{t("description1")}</p>
              <p>{t("description2")}</p>
            </div>

            {/* Stats */}
            <div className="mt-10 flex flex-wrap gap-10">
              <div>
                <p className="text-3xl font-black bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">2+</p>
                <p className="text-xs font-semibold text-muted-foreground mt-1.5 uppercase tracking-wider">Years Experience</p>
              </div>
              <div>
                <p className="text-3xl font-black bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">9</p>
                <p className="text-xs font-semibold text-muted-foreground mt-1.5 uppercase tracking-wider">Projects Shipped</p>
              </div>
              <div>
                <p className="text-3xl font-black bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">95+</p>
                <p className="text-xs font-semibold text-muted-foreground mt-1.5 uppercase tracking-wider">Performance Score</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
