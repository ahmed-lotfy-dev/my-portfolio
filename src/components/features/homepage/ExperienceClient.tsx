"use client";

import * as React from "react";
import { Calendar, Briefcase } from "lucide-react";
import Section from "@/src/components/ui/Section";
import { useTranslations } from "next-intl";

interface ExperienceClientProps {
  experiences: any[];
  isRTL: boolean;
}

export default function ExperienceClient({ experiences, isRTL }: ExperienceClientProps) {
  const t = useTranslations("experience");

  return (
    <Section variant="transparent" className="py-20 sm:py-28 relative overflow-hidden" id="experience">
      <div className="container max-w-3xl mx-auto px-4">
        <div className="max-w-2xl mb-14">
          <p className="text-xs font-semibold tracking-widest uppercase text-primary/70 mb-4">
            {t("label")}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            {t("heading_part1")} {t("heading_part2")}
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute top-0 bottom-0 left-[7px] md:left-1/2 w-px bg-border/50" />

          <div className="space-y-10">
            {experiences.map((exp: any, index: number) => (
              <div key={exp.id} className="relative flex gap-6 md:gap-0">
                {/* Dot */}
                <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 top-1 z-10">
                  <div className="w-[15px] h-[15px] rounded-full bg-background border-2 border-primary/50" />
                </div>

                {/* Content — alternating sides on desktop */}
                <div className={`pl-8 md:pl-0 md:w-1/2 ${index % 2 === 0 ? "md:pr-10 md:text-right" : "md:ml-auto md:pl-10"}`}>
                  <div className="p-5 rounded-lg border border-border/40 bg-card/20 hover:border-primary/15 transition-all duration-300">
                    <div className={`flex items-center gap-2 mb-3 text-xs text-primary font-medium ${index % 2 === 0 ? "md:justify-end" : ""}`}>
                      <Calendar className="w-3 h-3" />
                      <time dateTime={exp.date_en}>
                        {isRTL ? exp.date_ar : exp.date_en}
                      </time>
                    </div>

                    <h3 className="text-base font-semibold text-foreground mb-1">
                      {isRTL ? exp.role_ar : exp.role_en}
                    </h3>

                    <p className="text-sm text-muted-foreground mb-3 flex items-center gap-1.5">
                      <Briefcase className="w-3 h-3" />
                      {exp.company}
                    </p>

                    <p className="text-sm text-muted-foreground/70 leading-relaxed mb-4">
                      {isRTL ? exp.description_ar : exp.description_en}
                    </p>

                    <div className={`flex flex-wrap gap-1.5 ${index % 2 === 0 ? "md:justify-end" : ""}`}>
                      {exp.tech_stack.map((tech: string) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded text-[11px] font-medium text-muted-foreground/60 bg-muted/30"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
