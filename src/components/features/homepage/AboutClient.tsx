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
    <section className="relative overflow-hidden" id="about">
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full bg-blue-600/[0.04] blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-sky-500/[0.03] blur-[120px] pointer-events-none" />

      <div className="container relative mx-auto px-4">
        <div className="flex flex-col items-center gap-16 lg:flex-row lg:gap-20">
          <div className="relative w-full lg:w-5/12">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-r from-blue-600/10 via-blue-500/5 to-sky-500/5 opacity-70 blur-2xl" />
            <div className="relative overflow-hidden rounded-2xl border border-blue-500/10 bg-card/20 p-2">
              <Image
                src={myImage}
                width={400}
                height={400}
                quality={75}
                alt="Ahmed Lotfy"
                className={`rounded-xl w-full ${!isRTL ? "-scale-x-100" : ""}`}
              />
            </div>
            <div className="absolute -bottom-4 -right-2 sm:-bottom-6 sm:-right-4 flex items-center gap-2.5 rounded-xl border border-blue-500/15 bg-card/80 p-3 shadow-xl shadow-blue-500/10 backdrop-blur-xl">
              <div className="rounded-lg bg-blue-500/15 p-2">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.6)] animate-pulse" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-blue-400/60 uppercase tracking-wider">
                  Status
                </p>
                <p className="text-sm font-bold text-foreground">
                  Available for Hire
                </p>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-7/12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold tracking-widest uppercase border border-blue-500/15 mb-5">
              {t("title")}
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-foreground mb-8 leading-[1.1]">
              Solving complex problems with{" "}
              <span className="bg-linear-to-r from-blue-400 via-sky-400 to-indigo-400 bg-clip-text text-transparent">
                elegant engineering
              </span>
            </h2>

            <div className="space-y-5 text-base leading-relaxed text-muted-foreground">
              <p>{t("description1")}</p>
              <p>{t("description2")}</p>
            </div>

            <div className="mt-10 flex flex-wrap gap-10">
              <div>
                <p className="text-3xl font-black bg-linear-to-r from-blue-400 to-sky-400 bg-clip-text text-transparent">
                  2+
                </p>
                <p className="text-xs font-semibold text-muted-foreground mt-1.5 uppercase tracking-wider">
                  Years Experience
                </p>
              </div>
              <div>
                <p className="text-3xl font-black bg-linear-to-r from-blue-400 to-sky-400 bg-clip-text text-transparent">
                  9
                </p>
                <p className="text-xs font-semibold text-muted-foreground mt-1.5 uppercase tracking-wider">
                  Projects Shipped
                </p>
              </div>
              <div>
                <p className="text-3xl font-black bg-linear-to-r from-blue-400 to-sky-400 bg-clip-text text-transparent">
                  95+
                </p>
                <p className="text-xs font-semibold text-muted-foreground mt-1.5 uppercase tracking-wider">
                  Performance Score
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}