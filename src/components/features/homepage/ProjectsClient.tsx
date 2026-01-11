"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import ReadMoreText from "@/src/components/ui/ReadMoreText";
import { ExternalLink, Github, ArrowRight } from "lucide-react";
import ProjectCategories from "@/src/components/ui/ProjectCategories";
import { shouldShowApk } from "@/src/lib/utils/projectUtils";
import { getProjectCoverImage } from "@/src/lib/constants/images";
import { ProjectLinkTracker } from "./ProjectLinkTracker";
import { motion, Variants } from "framer-motion";

type Project = {
  id: string;
  slug: string | null;
  title_en: string;
  title_ar: string;
  desc_en: string;
  desc_ar: string;
  coverImage: string | null;
  liveLink: string;
  repoLink: string;
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

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="w-full grid gap-8 grid-cols-[repeat(auto-fit,minmax(320px,1fr))] justify-items-stretch"
    >
      {projects
        ?.filter((proj) => proj.published !== false)
        .map((proj) => {
          const showApk = shouldShowApk(proj.categories);

          return (
            <motion.div key={proj.id} variants={itemVariants}>
              <Card className="group flex h-full flex-col justify-between overflow-hidden border-border bg-card/50 backdrop-blur-sm hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500">
                <Link
                  href={proj.slug ? `/projects/${proj.slug}` : proj.liveLink}
                  target={proj.slug ? undefined : "_blank"}
                  className="block overflow-hidden"
                >
                  <div className="relative w-full h-64 cursor-pointer overflow-hidden">
                    <Image
                      src={getProjectCoverImage(proj.coverImage)}
                      alt={locale === "ar" ? proj.title_ar : proj.title_en}
                      fill
                      unoptimized={
                        proj.coverImage?.toLowerCase().endsWith(".gif")
                          ? true
                          : undefined
                      }
                      className={`transition-transform duration-700 group-hover:scale-110 ${showApk ? "object-contain p-4 bg-muted/50" : "object-cover"
                        }`}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
                  </div>
                </Link>
                <div className="p-6 flex flex-col grow gap-4">
                  <div>
                    <Link
                      href={proj.slug ? `/projects/${proj.slug}` : proj.liveLink}
                      target={proj.slug ? undefined : "_blank"}
                    >
                      <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors cursor-pointer antialiased">
                        {locale === "ar" ? proj.title_ar : proj.title_en}
                      </h3>
                    </Link>
                    <ReadMoreText
                      text={locale === "ar" ? proj.desc_ar : proj.desc_en}
                      maxLines={3}
                      className="text-muted-foreground text-sm leading-relaxed"
                      readMoreText={t.readmore}
                      showLessText={t.showless}
                    />
                    {proj.slug && (
                      <Link
                        href={`/projects/${proj.slug}`}
                        className="inline-flex items-center gap-1 text-primary text-sm font-medium mt-3 hover:underline underline-offset-4 w-fit group/link"
                      >
                        {t.view_case_study}
                        <ArrowRight
                          size={14}
                          className={`transition-transform group-hover/link:translate-x-1 ${locale === "ar" ? "rotate-180 group-hover/link:-translate-x-1" : ""
                            }`}
                        />
                      </Link>
                    )}
                  </div>

                  {/* Tech Stack */}
                  <ProjectCategories categories={proj.categories || []} />

                  <div className="flex gap-3 mt-4">
                    <ProjectLinkTracker
                      href={proj.liveLink}
                      projectTitle={locale === "ar" ? proj.title_ar : proj.title_en}
                      projectId={proj.id}
                      linkType="live"
                      target="_blank"
                      className="flex-1"
                    >
                      <Button className="w-full gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow">
                        <ExternalLink size={16} />
                        {showApk ? t.apk : t.live}
                      </Button>
                    </ProjectLinkTracker>
                    <ProjectLinkTracker
                      href={proj.repoLink}
                      projectTitle={locale === "ar" ? proj.title_ar : proj.title_en}
                      projectId={proj.id}
                      linkType="repo"
                      target="_blank"
                      className="flex-1"
                    >
                      <Button
                        variant="outline"
                        className="w-full gap-2 bg-transparent border-border hover:bg-muted text-primary"
                      >
                        <Github size={16} />
                        {t.repo}
                      </Button>
                    </ProjectLinkTracker>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
    </motion.div>
  );
}
