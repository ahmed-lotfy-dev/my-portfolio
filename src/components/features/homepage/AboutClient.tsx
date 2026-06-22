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
    <section className="relative overflow-hidden py-20 sm:py-28" id="about">
      <div className="container relative mx-auto px-4">
        <div className="flex flex-col items-start gap-12 lg:flex-row lg:gap-20">

          {/* Image */}
          <div className="relative w-full lg:w-5/12">
            <div className="relative overflow-hidden rounded-xl border border-border/40 bg-card/20 p-2">
              <Image
                src={myImage}
                width={400}
                height={400}
                quality={75}
                alt="Ahmed Lotfy"
                className={`rounded-lg w-full ${!isRTL ? "-scale-x-100" : ""}`}
              />
            </div>
          </div>

          {/* Content */}
          <div className="w-full lg:w-7/12">
            <p className="text-xs font-semibold tracking-widest uppercase text-primary/70 mb-4">
              {t("title")}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-8 leading-tight">
              Solving complex problems with clean architecture and intentional design.
            </h2>

            <div className="space-y-5 text-base leading-relaxed text-muted-foreground">
              <p>{t("description1")}</p>
              <p>{t("description2")}</p>
            </div>

            {/* Stats — inline, not cards */}
            <div className="mt-10 flex flex-wrap gap-8">
              <div>
                <p className="text-2xl font-bold text-foreground">2+</p>
                <p className="text-xs font-medium text-muted-foreground mt-1">Years Experience</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">9</p>
                <p className="text-xs font-medium text-muted-foreground mt-1">Projects Shipped</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">95+</p>
                <p className="text-xs font-medium text-muted-foreground mt-1">Performance Score</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
