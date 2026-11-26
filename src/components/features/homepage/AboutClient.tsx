"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { StaticImageData } from "next/image";
import { MapPin } from "@phosphor-icons/react";

type Props = {
  myImage: StaticImageData;
  isRTL: boolean;
};

const stats = [
  { value: "2+", key: "experience" },
  { value: "8", key: "projects" },
  { value: "95+", key: "performance" },
];

export default function AboutClient({ myImage, isRTL }: Props) {
  const t = useTranslations("about");

  return (
    <section
      id="about"
      className="relative border-b border-white/[0.07] px-6 py-24 md:px-8 md:py-32"
    >
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="surface p-2">
            <div className="relative aspect-square overflow-hidden rounded-[1.25rem] bg-[#0c0b08]">
              <Image
                src={myImage}
                alt="Ahmed Lotfy"
                fill
                quality={80}
                sizes="(max-width: 1024px) 100vw, 40vw"
                className={`object-cover ${isRTL ? "" : "-scale-x-100"}`}
              />
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between gap-4 px-1">
            <span className="flex items-center gap-2 text-sm text-foreground/80">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              {t("available")}
            </span>
            <span className="flex items-center gap-1.5 font-mono text-[11px] tracking-wide text-muted-foreground">
              <MapPin size={12} weight="bold" />
              {t("based")}
            </span>
          </div>
        </div>

        <div className="lg:col-span-7">
          <p className="eyebrow">{t("title")}</p>
          <h2
            className="mt-5 text-3xl font-semibold leading-[1.12] text-foreground sm:text-4xl md:text-5xl"
            dangerouslySetInnerHTML={{ __html: t("heading") }}
          />

          <div className="mt-8 max-w-[65ch] space-y-5 text-base leading-relaxed text-muted-foreground">
            <p>{t("description1")}</p>
            <p>{t("description2")}</p>
            <p className="border-l-2 border-primary/70 py-1 pl-5 text-foreground/85">
              {t("description3")}
            </p>
            <p>{t("description4")}</p>
          </div>

          <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-white/[0.08] pt-6">
            {stats.map((stat) => (
              <div key={stat.key}>
                <dt className="text-xs leading-snug text-muted-foreground">{t(`stats.${stat.key}`)}</dt>
                <dd className="tabular mt-1 text-2xl font-semibold text-foreground">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
