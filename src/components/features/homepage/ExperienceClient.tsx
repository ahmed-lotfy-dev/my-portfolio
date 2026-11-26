"use client";

import { useTranslations } from "next-intl";

interface Experience {
  id: string;
  role_en: string;
  role_ar: string;
  company: string;
  date_en: string;
  date_ar: string;
  description_en: string;
  description_ar: string;
  tech_stack: string[];
}

interface ExperienceClientProps {
  experiences: Experience[];
  isRTL: boolean;
}

export default function ExperienceClient({ experiences, isRTL }: ExperienceClientProps) {
  const t = useTranslations("experience");

  return (
    <section
      id="experience"
      className="relative border-b border-white/[0.07] px-6 py-24 md:px-8 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow">{t("label")}</p>
            <h2 className="mt-5 text-4xl font-semibold leading-[1.05] text-foreground sm:text-5xl">
              {t("heading_part1")}{" "}
              <span className="text-muted-foreground">{t("heading_part2")}</span>
            </h2>
          </div>
          <p className="max-w-sm text-base leading-relaxed text-muted-foreground lg:col-span-5 lg:justify-self-end">
            {t("description")}
          </p>
        </div>

        <div className="mt-14 border-t border-white/[0.08]">
          {experiences.map((exp) => (
            <article
              key={exp.id}
              className="grid gap-5 border-b border-white/[0.08] py-9 md:grid-cols-12 md:gap-8 md:py-10"
            >
              <div className="md:col-span-3">
                <time className="font-mono text-xs tracking-[0.04em] text-muted-foreground">
                  {isRTL ? exp.date_ar : exp.date_en}
                </time>
                <p className="mt-3 text-sm font-medium text-foreground/70">{exp.company}</p>
              </div>

              <div className="md:col-span-9">
                <h3 className="text-xl font-medium text-foreground md:text-2xl">
                  {isRTL ? exp.role_ar : exp.role_en}
                </h3>
                <p className="mt-3 max-w-[68ch] text-sm leading-relaxed text-muted-foreground">
                  {isRTL ? exp.description_ar : exp.description_en}
                </p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {exp.tech_stack.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-md border border-white/[0.08] px-2 py-1 font-mono text-[11px] tracking-wide text-muted-foreground"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
