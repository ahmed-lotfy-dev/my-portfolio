import Image from "next/image";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { getAllProjects } from "@/src/app/actions/projectsActions";
import Section from "@/src/components/ui/Section";
import ReadMoreText from "@/src/components/ui/ReadMoreText";

import { getTranslations, getLocale } from "next-intl/server";
import { ExternalLink, Github, ArrowRight } from "lucide-react";
import ProjectCategories from "@/src/components/ui/ProjectCategories";
import { shouldShowApk } from "@/src/lib/utils/projectUtils";

export default async function Projects() {
  const { allProjects } = await getAllProjects();
  const t = await getTranslations("projects");
  const locale = await getLocale();

  const isRTL = locale === "ar";

  return (
    <Section
      className="flex flex-col items-center p-4 py-20 border-t border-border/40 bg-background"
      id="projects"
    >
      <div className="container">
        <div className="text-center mb-16 space-y-4">
          <h2 className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium tracking-wide uppercase border border-primary/20 backdrop-blur-sm">
            {t("title")}
          </h2>
          <p className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            {t("description")}
          </p>
        </div>

        <div className="w-full grid gap-8 grid-cols-[repeat(auto-fit,minmax(320px,1fr))] justify-items-stretch">
          {allProjects
            ?.filter((proj) => proj.published !== false)
            .map((proj) => {
              const showApk = shouldShowApk(proj.categories);

              return (
                <Card
                  key={proj.id}
                  className="group flex h-full flex-col justify-between overflow-hidden border-border bg-card/50 backdrop-blur-sm hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
                >
                <Link href={proj.slug ? `/projects/${proj.slug}` : proj.liveLink} target={proj.slug ? undefined : "_blank"} className="block">
                    <div className="relative w-full h-64 cursor-pointer overflow-hidden">
                      <Image
                        src={proj.imageLink}
                        alt={locale === "ar" ? proj.title_ar : proj.title_en}
                        fill
                        unoptimized={
                          proj.imageLink?.toLowerCase().endsWith(".gif")
                            ? true
                            : undefined
                        }
                        className={`transition-transform duration-500 group-hover:scale-110 ${
                          showApk
                            ? "object-contain p-4 bg-muted/50"
                            : "object-cover"
                        }`}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    </div>
                </Link>
                <div className="p-6 flex flex-col grow gap-4">
                  <div>
                    <Link href={proj.slug ? `/projects/${proj.slug}` : proj.liveLink} target={proj.slug ? undefined : "_blank"}>
                      <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors cursor-pointer">
                        {locale === "ar" ? proj.title_ar : proj.title_en}
                      </h3>
                    </Link>
                    <ReadMoreText
                      text={locale === "ar" ? proj.desc_ar : proj.desc_en}
                      maxLines={3}
                      className="text-muted-foreground text-sm leading-relaxed"
                    />
                    {proj.slug && (
                        <Link href={`/projects/${proj.slug}`} className="inline-flex items-center gap-1 text-primary text-sm font-medium mt-3 hover:underline underline-offset-4 w-fit group/link">
                            {t("view_case_study")} 
                            <ArrowRight size={14} className={`transition-transform group-hover/link:translate-x-1 ${locale === "ar" ? "rotate-180 group-hover/link:-translate-x-1" : ""}`} />
                        </Link>
                    )}
                  </div>

                  {/* Tech Stack */}
                  <ProjectCategories categories={proj.categories || []} />

                  <div className="flex gap-3 mt-4">
                    <Link
                      href={proj.liveLink}
                      target="_blank"
                      className="flex-1"
                    >
                      <Button className="w-full gap-2 shadow-lg shadow-primary/20">
                        <ExternalLink size={16} />
                        {showApk
                          ? t("apk")
                          : t("live")}
                      </Button>
                    </Link>
                    <Link
                      href={proj.repoLink}
                      target="_blank"
                      className="flex-1"
                    >
                      <Button
                        variant="outline"
                        className="w-full gap-2 bg-transparent border-border hover:bg-muted text-primary"
                      >
                        <Github size={16} />
                        {t("repo")}
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
                );
            })}
        </div>
      </div>
    </Section>
  );
}
