"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import ReadMoreText from "@/src/components/ui/ReadMoreText";
import { ExternalLink, ArrowRight } from "lucide-react";
import { IoLogoGithub } from "react-icons/io5";
import ProjectCategories from "@/src/components/ui/ProjectCategories";
import { shouldShowApk } from "@/src/lib/utils/projectUtils";
import { getProjectCoverImage } from "@/src/lib/constants/images";
import { safeMediaUrl } from "@/src/lib/utils/mediaUrl";
import { ProjectLinkTracker } from "./ProjectLinkTracker";

type Project = {
  id: string;
  slug: string | null;
  title_en: string;
  title_ar: string;
  desc_en: string;
  desc_ar: string;
  cover_image: string | null;
  live_link: string;
  repo_link: string;
  categories: string[];
  published?: boolean;
};

type Props = {
  projects: Project[];
  locale: string;
  t: {
    readmore: string;
    showless: string;
    view_case_study: string;
    apk: string;
    live: string;
    repo: string;
  };
};

export default function ProjectsClient({ projects, locale, t }: Props) {
  const isRTL = locale === "ar";

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects
        ?.filter((proj) => proj.published !== false)
        .map((proj) => {
          const showApk = shouldShowApk(proj.categories);

          return (
            <article
              key={proj.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border/40 bg-card/30 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500"
            >
              {/* Cover */}
              <Link
                href={proj.slug ? `/${locale}/projects/${proj.slug}` : proj.live_link}
                target={proj.slug ? undefined : "_blank"}
                className="block overflow-hidden aspect-video relative"
              >
                <Image
                  src={safeMediaUrl(getProjectCoverImage(proj.cover_image))}
                  alt={locale === "ar" ? proj.title_ar : proj.title_en}
                  width={600}
                  height={340}
                  className={`w-full h-full transition-transform duration-700 group-hover:scale-105 ${showApk ? "object-contain p-4 bg-muted/20" : "object-cover"}`}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Link>

              {/* Content */}
              <div className="flex flex-1 flex-col p-6 gap-4">
                <Link
                  href={proj.slug ? `/${locale}/projects/${proj.slug}` : proj.live_link}
                  target={proj.slug ? undefined : "_blank"}
                >
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {locale === "ar" ? proj.title_ar : proj.title_en}
                  </h3>
                </Link>

                <ReadMoreText
                  text={locale === "ar" ? proj.desc_ar : proj.desc_en}
                  maxLines={2}
                  className="text-muted-foreground text-sm leading-relaxed"
                  readMoreText={t.readmore}
                  showLessText={t.showless}
                />

                {proj.slug && (
                  <Link
                    href={`/${locale}/projects/${proj.slug}`}
                    className="inline-flex items-center gap-1.5 text-primary text-xs font-semibold hover:underline underline-offset-4 w-fit"
                  >
                    {t.view_case_study}
                    <ArrowRight className={`w-3 h-3 ${locale === "ar" ? "rotate-180" : ""}`} />
                  </Link>
                )}

                <ProjectCategories categories={proj.categories || []} />

                <div className="flex gap-2.5 mt-auto pt-3 border-t border-border/20">
                  <ProjectLinkTracker
                    href={proj.live_link}
                    projectTitle={locale === "ar" ? proj.title_ar : proj.title_en}
                    projectId={proj.id}
                    linkType="live"
                    target="_blank"
                  >
                    <Button size="sm" className="gap-1.5 text-xs h-9 font-semibold">
                      <ExternalLink className="w-3.5 h-3.5" />
                      {showApk ? t.apk : t.live}
                    </Button>
                  </ProjectLinkTracker>
                  <ProjectLinkTracker
                    href={proj.repo_link}
                    projectTitle={locale === "ar" ? proj.title_ar : proj.title_en}
                    projectId={proj.id}
                    linkType="repo"
                    target="_blank"
                  >
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs h-9 border-border/40 hover:border-primary/30">
                      <IoLogoGithub className="w-3.5 h-3.5" />
                      {t.repo}
                    </Button>
                  </ProjectLinkTracker>
                </div>
              </div>
            </article>
          );
        })}
    </div>
  );
}
