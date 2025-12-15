import Image from "next/image";
import { getTranslations, getLocale } from "next-intl/server";

import html from "@/public/images/skills/html.svg";
import css from "@/public/images/skills/css3.svg";
import js from "@/public/images/skills/javascript.svg";
import react from "@/public/images/skills/react.svg";
import nodejs from "@/public/images/skills/nodejs.svg";
import mongodb from "@/public/images/skills/mongodb.svg";
import graphql from "@/public/images/skills/graphql.svg";
import github from "@/public/images/skills/github.svg";
import linux from "@/public/images/skills/linux.svg";
import docker from "@/public/images/skills/docker.svg";

interface Skill {
  src: string;
  alt: string;
}

const skillsList: Skill[] = [
  { src: html, alt: "HTML" },
  { src: css, alt: "CSS" },
  { src: js, alt: "JavaScript" },
  { src: react, alt: "React" },
  { src: nodejs, alt: "Node.js" },
  { src: mongodb, alt: "MongoDB" },
  { src: graphql, alt: "GraphQL" },
  { src: github, alt: "GitHub" },
  { src: linux, alt: "Linux" },
  { src: docker, alt: "Docker" },
];

export default async function Skills() {
  // Duplicate skills to create seamless loop
  const loopSkills = [...skillsList, ...skillsList];
  const t = await getTranslations("skills");
  const locale = await getLocale();
  const isRTL = locale === "ar";

  return (
    <section className="flex flex-col items-center py-20 px-4 border-t border-border/40 bg-linear-to-b from-muted/20 to-transparent" id="skills">
      <div className="container">
        <div className="text-center mb-16 space-y-4">
          <h2 className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium tracking-wide uppercase border border-primary/20 backdrop-blur-sm">
            {t("title")}
          </h2>
          <p className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            {t("description")}
          </p>
        </div>

        {/* Auto-scrolling horizontal list */}
        <div
          className="relative overflow-hidden w-full max-w-6xl mx-auto"
          dir="ltr"
        >
          {/* Gradient Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-linear-to-r from-background to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-linear-to-l from-background to-transparent z-10" />

          <div
            className={`inline-flex w-max gap-8 will-change-transform py-8 ${
              isRTL ? "animate-scrollXReverse" : "animate-scrollX"
            }`}
          >
            {loopSkills.map((skill, index) => (
              <div
                key={`${skill.alt}-${index}`}
                className="flex flex-col items-center justify-center min-w-[100px] sm:min-w-[120px] p-6 rounded-2xl bg-card/50 border border-border backdrop-blur-sm hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group"
              >
                <div className="relative w-12 h-12 sm:w-16 sm:h-16 transition-transform duration-300 group-hover:scale-110">
                  <Image
                    src={skill.src}
                    alt={skill.alt}
                    fill
                    className="object-contain filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                  />
                </div>
                <span className="mt-4 text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  {skill.alt}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
