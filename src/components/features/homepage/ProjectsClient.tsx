"use client";

import Image from "next/image";
import Link from "next/link";
import ReadMoreText from "@/src/components/ui/ReadMoreText";
import { ArrowUpRight, GithubLogo } from "@phosphor-icons/react";
import ProjectCategories from "@/src/components/ui/ProjectCategories";
import { shouldShowApk } from "@/src/lib/utils/projectUtils";
import { getProjectCoverImage } from "@/src/lib/constants/images";
import { safeMediaUrl } from "@/src/lib/utils/mediaUrl";
import { ProjectLinkTracker } from "./ProjectLinkTracker";
import { cn } from "@/src/lib/utils";

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
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {projects.map((proj, index) => {
        const showApk = shouldShowApk(proj.categories);
        const title = locale === "ar" ? proj.title_ar : proj.title_en;
        const description = locale === "ar" ? proj.desc_ar : proj.desc_en;
        const featured = index === 0;

        return (
          <article
            key={proj.id}
            className={cn(
              "group flex flex-col overflow-hidden rounded-3xl border border-white/[0.07] bg-card transition-colors duration-300 ease-brand hover:bg-[#181818]",
              featured && "md:col-span-2 md:grid md:grid-cols-2"
            )}
          >
            <Link
              href={proj.slug ? `/${locale}/projects/${proj.slug}` : proj.live_link}
              target={proj.slug ? undefined : "_blank"}
              className={cn(
                "relative block overflow-hidden",
                featured ? "aspect-[16/10] md:aspect-auto md:h-full" : "aspect-[16/10]"
              )}
            >
              <Image
                src={safeMediaUrl(getProjectCoverImage(proj.cover_image))}
                alt={title}
                fill
                unoptimized={proj.cover_image?.toLowerCase().endsWith(".gif") ? true : undefined}
                className={cn(
                  "transition-transform duration-700 ease-brand group-hover:scale-[1.03]",
                  showApk ? "object-contain p-6" : "object-cover"
                )}
                sizes={featured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 50vw"}
                loading={index < 2 ? "eager" : "lazy"}
              />
            </Link>

            <div className="flex flex-1 flex-col p-6 md:p-8">
              <div className="flex items-start justify-between gap-4">
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground/60">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <ArrowUpRight
                  size={18}
                  className="text-muted-foreground/50 transition-all duration-300 ease-brand group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                />
              </div>

              <Link
                href={proj.slug ? `/${locale}/projects/${proj.slug}` : proj.live_link}
                target={proj.slug ? undefined : "_blank"}
                className="mt-4"
              >
                <h3 className="text-xl font-medium text-foreground transition-colors duration-300 group-hover:text-primary md:text-2xl">
                  {title}
                </h3>
              </Link>

              <ReadMoreText
                text={description}
                maxLines={featured ? 5 : 3}
                className="mt-3 text-sm leading-relaxed text-muted-foreground"
                readMoreText={t.readmore}
                showLessText={t.showless}
              />

              {proj.slug && (
                <Link
                  href={`/${locale}/projects/${proj.slug}`}
                  className="mt-4 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary-light"
                >
                  {t.view_case_study}
                  <ArrowUpRight size={14} weight="bold" />
                </Link>
              )}

              <ProjectCategories categories={proj.categories || []} />

              <div className="mt-6 flex items-center gap-6">
                <ProjectLinkTracker
                  href={proj.live_link}
                  projectTitle={title}
                  projectId={proj.id}
                  linkType="live"
                  target="_blank"
                  className="inline-flex"
                >
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-primary">
                    {showApk ? t.apk : t.live}
                    <ArrowUpRight size={14} weight="bold" />
                  </span>
                </ProjectLinkTracker>
                <ProjectLinkTracker
                  href={proj.repo_link}
                  projectTitle={title}
                  projectId={proj.id}
                  linkType="repo"
                  target="_blank"
                  className="inline-flex"
                >
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                    <GithubLogo size={15} />
                    {t.repo}
                  </span>
                </ProjectLinkTracker>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
