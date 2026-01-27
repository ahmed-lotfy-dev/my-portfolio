"use client";

import Image from "next/image";
import { motion, Variants } from "framer-motion";
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
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const imageVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9, x: isRTL ? 50 : -50 },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const stats = [
    { icon: Trophy, label: "Experience", value: "2 Years", color: "text-blue-500" },
    { icon: Target, label: "Projects", value: "8 Projects", color: "text-emerald-500" },
    { icon: Zap, label: "Performance", value: "95+ Score", color: "text-amber-500" },
  ];

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden bg-background" id="about">

      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-secondary/5 rounded-full blur-[100px]" />
      </div>

      <div className="container relative mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col lg:flex-row items-center gap-12 lg:gap-32"
        >

          <motion.div variants={imageVariants} className="relative group lg:w-5/12">
            <div className="absolute -inset-4 bg-linear-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-[2.5rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-500" />
            <div className="relative overflow-hidden rounded-4xl border border-border/50 bg-card/50 backdrop-blur-sm p-3 shadow-2xl">
              <Image
                src={myImage}
                width={400}
                height={400}
                quality={75}
                alt="Ahmed Lotfy"
                className={`rounded-2xl transition-transform duration-700 group-hover:scale-105 ${isRTL ? "scale-x-[-1]" : ""
                  }`}
              />
            </div>


            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 hidden sm:flex items-center gap-3 bg-card/80 backdrop-blur-xl border border-border/50 p-4 rounded-2xl shadow-xl"
            >
              <div className="p-2 bg-primary/10 rounded-lg">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Status</p>
                <p className="text-sm font-black text-foreground leading-none">Available for Hire</p>
              </div>
            </motion.div>
          </motion.div>


          <div className="lg:w-1/2 space-y-10">
            <motion.div variants={itemVariants} className="space-y-4">
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-[0.2em] uppercase border border-primary/20 backdrop-blur-sm">
                {t("title")}
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground tracking-tight leading-[1.1]">
                Solving Complex Problems with <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent italic">Elegant Design.</span>
              </h2>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-6 text-lg text-muted-foreground leading-relaxed antialiased">
              <p>{t("description1")}</p>
              <p>{t("description2")}</p>
              <p className="font-bold text-foreground/80 border-l-4 border-primary pl-6 py-2 bg-primary/5 rounded-r-xl">
                {t("description3")}
              </p>
            </motion.div>


            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
              {stats.map((stat, idx) => (
                <div key={idx} className="group p-4 rounded-2xl border border-border/50 bg-card/20 hover:bg-card/40 hover:border-primary/30 transition-all duration-300">
                  <stat.icon className={`w-6 h-6 mb-3 ${stat.color} group-hover:scale-110 transition-transform`} />
                  <p className="text-2xl font-black text-foreground mb-1">{stat.value}</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
