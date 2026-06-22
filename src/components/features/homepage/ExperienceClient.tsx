"use client";

import * as React from "react";
import { Calendar, Briefcase } from "lucide-react";
import Section from "@/src/components/ui/Section";
import { useTranslations } from "next-intl";

interface ExperienceClientProps {
  experiences: any[];
  isRTL: boolean;
}

export default function ExperienceClient({
  experiences,
  isRTL,
}: ExperienceClientProps) {
  const t = useTranslations("experience");

  return (
    <Section
      variant="transparent"
      className="relative overflow-hidden"
      id="experience"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/[0.02] rounded-full blur-[150px] pointer-events-none" />

      <div className="container max-w-3xl mx-auto px-4">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold tracking-widest uppercase border border-blue-500/15 mb-5">
            {t("label")}
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-foreground">
            {t("heading_part1")}{" "}
            <span className="bg-linear-to-r from-blue-400 via-sky-400 to-indigo-400 bg-clip-text text-transparent">
              {t("heading_part2")}
            </span>
          </h2>
        </div>

        <div className="relative">
          <div className="absolute top-0 bottom-0 left-[7px] md:left-1/2 w-px bg-gradient-to-b from-blue-500/30 via-blue-500/10 to-transparent" />

          <div className="space-y-8">
            {experiences.map((exp: any, index: number) => (
              <div key={exp.id} className="relative flex gap-6 md:gap-0">
                <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 top-1.5 z-10">
                  <div className="w-4 h-4 rounded-full bg-background border-2 border-blue-500/60 shadow-[0_0_14px_rgba(59,130,246,0.4)]" />
                </div>

                <div
                  className={`pl-8 md:pl-0 md:w-1/2 ${
                    index % 2 === 0
                      ? "md:pr-12 md:text-right"
                      : "md:ml-auto md:pl-12"
                  }`}
                >
                  <div className="p-6 rounded-xl card-blue hover:border-blue-500/15 transition-all duration-300 group">
                    <div
                      className={`flex items-center gap-2 mb-3 text-xs text-blue-400 font-semibold ${
                        index % 2 === 0 ? "md:justify-end" : ""
                      }`}
                    >
                      <Calendar className="w-3 h-3" />
                      <time dateTime={exp.date_en}>
                        {isRTL ? exp.date_ar : exp.date_en}
                      </time>
                    </div>

                    <h3 className="text-base font-bold text-foreground mb-1 group-hover:text-blue-400 transition-colors">
                      {isRTL ? exp.role_ar : exp.role_en}
                    </h3>

                    <p className="text-sm text-muted-foreground mb-3 flex items-center gap-1.5">
                      <Briefcase className="w-3 h-3" />
                      {exp.company}
                    </p>

                    <p className="text-sm text-muted-foreground/70 leading-relaxed mb-4">
                      {isRTL ? exp.description_ar : exp.description_en}
                    </p>

                    <div
                      className={`flex flex-wrap gap-1.5 ${
                        index % 2 === 0 ? "md:justify-end" : ""
                      }`}
                    >
                      {exp.tech_stack.map((tech: string) => (
                        <span
                          key={tech}
                          className="px-2.5 py-1 rounded-md text-[11px] font-medium text-muted-foreground/50 bg-blue-500/[0.03] border border-blue-500/8"
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