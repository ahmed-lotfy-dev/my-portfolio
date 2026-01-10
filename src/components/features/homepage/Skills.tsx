import { getTranslations, getLocale } from "next-intl/server";
import SkillsSlider from "./SkillsSlider";

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
  src: any;
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
  const t = await getTranslations("skills");
  const locale = await getLocale();
  const isRTL = locale === "ar";

  return (
    <section className="flex flex-col items-center py-24 px-4 border-t border-border/40 bg-linear-to-b from-muted/20 to-transparent relative overflow-hidden" id="skills">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container relative z-10">
        <div className="text-center mb-20 space-y-6">
          <div className="flex justify-center">
            <h2 className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold tracking-wider uppercase border border-primary/20 backdrop-blur-md">
              {t("title")}
            </h2>
          </div>
          <p className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight max-w-3xl mx-auto leading-tight">
            {t("description")}
          </p>
        </div>

        <SkillsSlider skills={skillsList} isRTL={isRTL} />
      </div>
    </section>
  );
}
