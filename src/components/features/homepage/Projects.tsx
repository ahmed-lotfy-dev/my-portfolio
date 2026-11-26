import { getTranslations, getLocale } from "next-intl/server";
import projectsData from "@/src/data/projects.json";
import ProjectsClient from "./ProjectsClient";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

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
    <section
      id="projects"
      className="relative border-b border-white/[0.07] px-6 py-24 md:px-8 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">{t("label")}</p>
            <h2 className="mt-5 text-4xl font-semibold leading-[1.05] text-foreground sm:text-5xl">
              {t("title")}
            </h2>
          </div>
          <p className="max-w-sm text-base leading-relaxed text-muted-foreground md:text-right">
            {t("description")}
          </p>
        </div>

        <div className="mt-14">
          <ProjectsClient projects={allProjects} locale={locale} t={translations} />
        </div>

        <div className="mt-12">
          <Link
            href={`/${locale}/projects`}
            className="group inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors duration-300 hover:text-primary"
          >
            {t("view_all")}
            <ArrowRight
              size={16}
              weight="bold"
              className="transition-transform duration-300 ease-brand group-hover:translate-x-1 rtl:rotate-180"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
