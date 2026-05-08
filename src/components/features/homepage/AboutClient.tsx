"use client";

import Image from "next/image";
import { m, Variants } from "motion/react";
import { useTranslations } from "next-intl";
import { Sparkles, Trophy, Target, Zap } from "lucide-react";
import { StaticImageData } from "next/image";

type Props = {
  myImage: StaticImageData;
  isRTL: boolean;
};

export default function AboutClient({ myImage, isRTL }: Props) {
  const t = useTranslations("about");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: "easeOut" },
    },
  };

  const imageVariants: Variants = {
    hidden: { opacity: 0, scale: 0.96, y: 24 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.65, ease: "easeOut" },
    },
  };

  const stats = [
    { icon: Trophy, label: "Experience", value: "2 Years", color: "text-primary" },
    { icon: Target, label: "Projects", value: "9 Projects", color: "text-primary-light" },
    { icon: Zap, label: "Performance", value: "95+ Score", color: "text-primary-dark" },
  ];

  return (
    <section className="relative overflow-hidden py-28 sm:py-36 lg:py-44" id="about">
      {/* Background atmosphere */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-24 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[140px]" />
        <div className="absolute bottom-1/4 right-0 h-[400px] w-[400px] translate-x-1/3 rounded-full bg-secondary/5 blur-[140px]" />
      </div>

      <div className="container relative mx-auto px-6 lg:px-8">
        <m.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col items-center gap-16 lg:flex-row lg:gap-32 xl:gap-40"
        >
          {/* Image Column */}
          <m.div variants={imageVariants} className="group relative w-full max-w-md lg:w-5/12 shrink-0">
            <div className="absolute -inset-5 rounded-[3rem] bg-linear-to-r from-primary/10 via-secondary/10 to-primary/10 opacity-30 blur-2xl transition duration-700 group-hover:opacity-50" />
            <div className="relative overflow-hidden rounded-[2rem] border border-border/40 bg-card/40 p-4 shadow-2xl backdrop-blur-sm">
              <Image
                src={myImage}
                width={400}
                height={400}
                quality={85}
                alt="Ahmed Shoman"
                style={{ width: "auto", height: "auto" }}
                className={`rounded-xl transition-transform duration-700 group-hover:scale-[1.02] ${!isRTL ? "-scale-x-100" : ""}`}
              />
            </div>

            {/* Status Badge — floating on image */}
            <m.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
              className="absolute -top-4 -right-4 hidden items-center gap-3 rounded-2xl border border-border/40 bg-card/80 p-4 pr-5 shadow-xl backdrop-blur-xl sm:flex"
            >
              <div className="rounded-xl bg-primary/10 p-2.5">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="mb-1 text-[11px] font-bold leading-none tracking-[0.18em] text-muted-foreground uppercase">
                  Status
                </p>
                <p className="text-sm font-black leading-none text-foreground">
                  Available for Hire
                </p>
              </div>
            </m.div>
          </m.div>

          {/* Content Column */}
          <div className="space-y-12 lg:w-7/12">
            {/* Section label + Heading */}
            <m.div variants={itemVariants} className="space-y-6">
              <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-5 py-2 text-xs font-bold tracking-[0.22em] text-primary uppercase backdrop-blur-sm">
                {t("title")}
              </span>
              <h2 className="text-4xl font-black leading-[1.08] tracking-tight text-foreground md:text-5xl lg:text-6xl">
                Solving Complex Problems with{" "}
                <span className="text-primary italic">Elegant Design.</span>
              </h2>
            </m.div>

            {/* Description paragraphs */}
            <m.div variants={itemVariants} className="space-y-8 text-lg leading-relaxed text-muted-foreground antialiased">
              <p>{t("description1")}</p>
              <p>{t("description2")}</p>
              <div className="relative rounded-2xl bg-primary/5 border border-primary/10 p-6 pl-8">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />
                <p className="text-base md:text-lg font-bold text-foreground/80">
                  {t("description3")}
                </p>
              </div>
            </m.div>

            {/* Stats */}
            <m.div variants={itemVariants} className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="group rounded-2xl border border-border/40 bg-card/20 p-6 transition-all duration-500 hover:border-primary/30 hover:bg-card/40 hover:shadow-lg hover:shadow-primary/5"
                >
                  <div className={cn(
                    "mb-4 inline-flex p-3 rounded-xl bg-background border border-border/30 group-hover:border-primary/15 transition-all duration-500",
                    stat.color
                  )}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <p className="mb-1.5 text-2xl font-black text-foreground tracking-tight">{stat.value}</p>
                  <p className="text-xs font-bold tracking-[0.15em] text-muted-foreground uppercase">{stat.label}</p>
                </div>
              ))}
            </m.div>
          </div>
        </m.div>
      </div>
    </section>
  );
}

function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
