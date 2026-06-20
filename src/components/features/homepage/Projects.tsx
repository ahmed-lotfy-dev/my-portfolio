import Section from "@/src/components/ui/Section";
import { getTranslations, getLocale } from "next-intl/server";
import projectsData from "@/src/data/projects.json";
import ProjectsClient from "./ProjectsClient";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default async function Projects() {
  const locale = await getLocale();
  const t = await getTranslations("projects");
  const allProjects = projectsData.filter((p) => p.published !== false);

  const translations = {
    readmore: t("readmore"),
    showless: t("showless"),
    view_case_study: t("view_case_study"),
    apk: t("apk"),
    live: t("live"),
    repo: t("repo"),
  };

  return (
    <Section variant="transparent" className="relative overflow-hidden" id="projects">
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 -translate-x-1/2" />
      <div className="container">
        <div className="text-center mb-16 space-y-4">
          <h2 className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium tracking-wide uppercase border border-primary/20 backdrop-blur-sm">
            {t("title")}
          </h2>
          <p className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight antialiased">
            {t("description")}
          </p>
        </div>

        <ProjectsClient projects={allProjects} locale={locale} t={translations} />

        <div className="mt-12 text-center">
          <Link
            href={`/${locale}/projects`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-primary/30 bg-primary/5 text-primary font-semibold hover:bg-primary/10 hover:border-primary/50 transition-all group"
          >
            View All Projects
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </Section>
  );
}
