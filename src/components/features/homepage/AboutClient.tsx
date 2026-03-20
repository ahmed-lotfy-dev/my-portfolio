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
        staggerChildren: 0.14,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const imageVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: "easeOut" },
    },
  };

  const stats = [
    { icon: Trophy, label: "Experience", value: "2 Years", color: "text-blue-500" },
    { icon: Target, label: "Projects", value: "8 Projects", color: "text-emerald-500" },
    { icon: Zap, label: "Performance", value: "95+ Score", color: "text-amber-500" },
  ];

  return (
    <section className="relative overflow-hidden bg-background py-24 sm:py-32" id="about">
      <div className="pointer-events-none absolute top-0 left-0 h-full w-full overflow-hidden">
        <div className="absolute top-1/4 -left-20 h-80 w-80 rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute right-0 bottom-1/4 h-80 w-80 translate-x-1/4 rounded-full bg-secondary/5 blur-[100px]" />
      </div>

      <div className="container relative mx-auto px-4">
        <m.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col items-center gap-12 lg:flex-row lg:gap-32"
        >
          <m.div variants={imageVariants} className="group relative lg:w-5/12">
            <div className="absolute -inset-4 rounded-[2.5rem] bg-linear-to-r from-primary/15 via-secondary/15 to-primary/15 opacity-40 blur-2xl transition duration-700 group-hover:opacity-60" />
            <div className="relative overflow-hidden rounded-4xl border border-border/50 bg-card/50 p-3 shadow-2xl">
              <Image
                src={myImage}
                width={400}
                height={400}
                quality={75}
                alt="Ahmed Lotfy"
                className={`rounded-2xl transition-transform duration-500 group-hover:scale-[1.01] ${!isRTL ? "-scale-x-100" : ""}`}
              />
            </div>

            <m.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.12, duration: 0.45, ease: "easeOut" }}
              className="absolute -top-6 -right-6 hidden items-center gap-3 rounded-2xl border border-border/50 bg-card/80 p-4 shadow-xl backdrop-blur-xl sm:flex"
            >
              <div className="rounded-lg bg-primary/10 p-2">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="mb-1 text-xs font-bold leading-none tracking-widest text-muted-foreground uppercase">
                  Status
                </p>
                <p className="text-sm font-black leading-none text-foreground">
                  Available for Hire
                </p>
              </div>
            </m.div>
          </m.div>

          <div className="space-y-10 lg:w-1/2">
            <m.div variants={itemVariants} className="space-y-4">
              <span className="inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-bold tracking-[0.2em] text-primary uppercase backdrop-blur-sm">
                {t("title")}
              </span>
              <h2 className="text-4xl font-black leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-6xl">
                Solving Complex Problems with <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent italic">Elegant Design.</span>
              </h2>
            </m.div>

            <m.div variants={itemVariants} className="space-y-6 text-lg leading-relaxed text-muted-foreground antialiased">
              <p>{t("description1")}</p>
              <p>{t("description2")}</p>
              <p className="rounded-r-xl border-l-4 border-primary bg-primary/5 py-2 pl-6 font-bold text-foreground/80">
                {t("description3")}
              </p>
            </m.div>

            <m.div variants={itemVariants} className="grid grid-cols-1 gap-6 pt-4 sm:grid-cols-3">
              {stats.map((stat, idx) => (
                <div key={idx} className="group rounded-2xl border border-border/50 bg-card/20 p-4 transition-all duration-300 hover:border-primary/30 hover:bg-card/40">
                  <stat.icon className={`mb-3 h-6 w-6 ${stat.color}`} />
                  <p className="mb-1 text-2xl font-black text-foreground">{stat.value}</p>
                  <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">{stat.label}</p>
                </div>
              ))}
            </m.div>
          </div>
        </m.div>
      </div>
    </section>
  );
}
