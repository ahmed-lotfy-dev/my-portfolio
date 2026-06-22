import Section from "@/src/components/ui/Section";
import { getTranslations, getLocale } from "next-intl/server";
import projectsData from "@/src/data/projects.json";
import ProjectsClient from "./ProjectsClient";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default async function Projects() {
  const locale = await getLocale();
  const t = await getTranslations("projects");
  const allProjects = projectsData
    .filter((p) => p.published !== false)
    .sort((a, b) => a.display_order - b.display_order);

  const translations = {
    readmore: t("readmore"),
    showless: t("showless"),
    view_case_study: t("view_case_study"),
    apk: t("apk"),
    live: t("live"),
    repo: t("repo"),
  };

  return (
    <Section variant="transparent" className="py-24 sm:py-32 relative overflow-hidden" id="projects">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-bold tracking-widest uppercase text-primary/70 mb-4">
            {t("title")}
          </p>
          <h3 className="text-3xl md:text-5xl font-black tracking-tight text-foreground mb-5">
            {t("description")}
          </h3>
        </div>

        <ProjectsClient projects={allProjects} locale={locale} t={translations} />

        <div className="mt-14 text-center">
          <Link
            href={`/${locale}/projects`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border/40 bg-card/20 text-sm font-semibold text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all duration-300 group"
          >
            View All Projects
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </Section>
  );
}
