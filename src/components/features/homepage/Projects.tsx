import Section from "@/src/components/ui/Section";
import { getTranslations, getLocale } from "next-intl/server";
import { getAllProjects } from "@/src/app/actions/projectsActions";
import ProjectsClient from "./ProjectsClient";

export default async function Projects() {
  const { allProjects: projects } = await getAllProjects();
  const t = await getTranslations("projects");
  const locale = await getLocale();

  const translations = {
    readmore: t("readmore"),
    showless: t("showless"),
    view_case_study: t("view_case_study"),
    apk: t("apk"),
    live: t("live"),
    repo: t("repo"),
  };

  return (
    <Section
      variant="surface"
      className="relative overflow-hidden"
      id="projects"
    >
      {/* Background Decor - Mesh Gradient */}
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

        <ProjectsClient projects={projects ?? []} locale={locale} t={translations} />
      </div>
    </Section>
  );
}
