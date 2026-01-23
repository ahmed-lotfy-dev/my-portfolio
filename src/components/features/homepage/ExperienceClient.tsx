"use client";

import * as React from "react";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Calendar, Briefcase, Sparkles } from "lucide-react";
import Section from "@/src/components/ui/Section";
import { useTranslations } from "next-intl";
import { cn } from "@/src/lib/utils";

interface ExperienceClientProps {
  experiences: any[];
  isRTL: boolean;
}

function ExperienceCard({ exp, index, isRTL }: { exp: any; index: number; isRTL: boolean }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? (isRTL ? 50 : -50) : (isRTL ? -50 : 50) }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={cn(
        "relative flex flex-col md:flex-row gap-8 mb-12 last:mb-0",
        index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
      )}
    >
      {/* Timeline Connector & Pulse Node */}
      <div
        className={cn(
          "absolute top-0 flex items-center justify-center translate-y-[28px] z-10",
          isRTL ? "right-[11px] md:right-1/2 md:translate-x-1/2" : "left-[11px] md:left-1/2 md:-translate-x-1/2"
        )}
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute w-8 h-8 rounded-full bg-primary/20 blur-sm"
        />
        <div className="w-4 h-4 rounded-full bg-background border-2 border-primary shadow-[0_0_10px_rgba(var(--primary),0.5)] flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
        </div>
      </div>

      {/* Content Layer */}
      <div className={cn("md:w-1/2", isRTL ? "pr-10 md:pr-0" : "pl-10 md:pl-0")}>
        <motion.div
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className={cn(
            "group p-6 md:p-8 rounded-4xl border border-border/50 bg-card/30 backdrop-blur-xl relative overflow-hidden transition-all duration-500 hover:border-primary/40 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] hover:bg-card/40",
            index % 2 === 0 ? "md:text-right" : "md:text-left text-left"
          )}
        >
          {/* Subtle Accent Glow */}
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
          </div>

          <div className={cn(
            "flex items-center gap-2 mb-4 text-primary bg-primary/10 px-3 py-1 rounded-full w-fit",
            index % 2 === 0 ? "md:ml-auto" : "md:mr-auto"
          )}>
            <Calendar className="w-3.5 h-3.5" />
            <span className="font-mono text-xs uppercase tracking-[0.2em] font-bold">
              {isRTL ? exp.date_ar : exp.date_en}
            </span>
          </div>

          <h3 className="text-xl md:text-2xl font-black text-foreground mb-2 tracking-tight group-hover:text-primary transition-colors duration-300">
            {isRTL ? exp.role_ar : exp.role_en}
          </h3>

          <div className={cn(
            "text-base font-semibold text-muted-foreground/80 mb-6 flex items-center gap-2",
            index % 2 === 0 ? "md:justify-end" : "md:justify-start"
          )}>
            <Briefcase className="w-4 h-4" />
            <span>{exp.company}</span>
          </div>

          <p className="text-muted-foreground leading-relaxed mb-8 text-sm font-medium opacity-90">
            {isRTL ? exp.description_ar : exp.description_en}
          </p>

          <div className={cn(
            "flex flex-wrap gap-2.5",
            index % 2 === 0 ? "md:justify-end" : "md:justify-start"
          )}>
            {exp.tech_stack.map((tech: string) => (
              <span
                key={tech}
                className="px-2 py-0.5 rounded-md bg-secondary/30 text-sm font-medium text-muted-foreground border border-transparent hover:border-primary/20 hover:text-primary transition-all duration-300 cursor-default"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Spacer */}
      <div className="hidden md:block md:w-1/2" />
    </motion.div>
  );
}

export default function ExperienceClient({ experiences, isRTL }: ExperienceClientProps) {
  const [hasMounted, setHasMounted] = React.useState(false);

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  const t = useTranslations("experience");
  return (
    <Section variant="alternate" className="py-32 px-4 relative overflow-hidden" id="experience">
      {/* Background Decor - Mesh Gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container max-w-6xl mx-auto relative">
        <div className="text-center mb-32 space-y-6">
          <motion.div
            initial={hasMounted ? { opacity: 0, y: 20 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary/10 text-primary border border-primary/20 backdrop-blur-sm shadow-[0_0_20px_rgba(var(--primary),0.1)]"
          >
            <span className="text-md font-black uppercase tracking-[0.3em]">
              {t("label")}
            </span>
          </motion.div>

          <motion.h2
            initial={hasMounted ? { opacity: 0, y: 30 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black tracking-tighter text-foreground"
          >
            {t("heading_part1")} <span className="text-primary italic">{t("heading_part2")}</span>
          </motion.h2>
        </div>

        <div className="relative">
          {/* Main Visual Timeline Line */}
          <div
            className={cn(
              "absolute top-0 bottom-0 w-[2px] bg-linear-to-b from-transparent via-primary/40 to-transparent",
              isRTL ? "right-[11px] md:right-1/2" : "left-[11px] md:left-1/2"
            )}
          >
            {/* Animated Light Beam */}
            <motion.div
              animate={{
                top: ["0%", "100%"],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute w-full h-40 bg-linear-to-b from-transparent via-primary to-transparent shadow-[0_0_30px_rgba(var(--primary),0.8)]"
            />
          </div>

          <div className="space-y-4">
            {experiences.map((exp: any, index: number) => (
              <ExperienceCard
                key={exp.id}
                exp={exp}
                index={index}
                isRTL={isRTL}
              />
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
