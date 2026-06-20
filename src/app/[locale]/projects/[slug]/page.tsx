import projectsData from "@/src/data/projects.json";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { IoLogoGithub } from "react-icons/io5";
import { Button } from "@/src/components/ui/button";
import StructuredData from "@/src/components/seo/StructuredData";
import { BreadcrumbSchema } from "@/src/components/seo/BreadcrumbSchema";
import { ImageCarousel } from "@/src/components/ui/ImageCarousel";
import { BackButton } from "@/src/components/ui/BackButton";

function isNonEmptyUrl(url: string | null | undefined): url is string {
  return typeof url === "string" && url.trim().length > 0;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params;
  const project = projectsData.find((p) => p.slug === slug && p.published !== false);
  if (!project) return { title: "Project Not Found" };

  const title = locale === "ar" ? project.title_ar : project.title_en;
  const description = locale === "ar" ? project.desc_ar : project.desc_en;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://ahmedlotfy.site/${locale}/projects/${slug}`,
      siteName: "Ahmed Lotfy Portfolio",
      images: [{ url: project.cover_image || "", width: 1200, height: 630, alt: title }],
      locale: locale === "ar" ? "ar_EG" : "en_US",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [project.cover_image || ""],
      creator: "@ahmedlotfy_dev",
    },
    alternates: {
      canonical: `https://ahmedlotfy.site/${locale}/projects/${slug}`,
      languages: {
        en: `https://ahmedlotfy.site/en/projects/${slug}`,
        ar: `https://ahmedlotfy.site/ar/projects/${slug}`,
        "x-default": `https://ahmedlotfy.site/en/projects/${slug}`,
      },
    },
  };
}

export default async function ProjectDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await getLocale();
  const t = await getTranslations("projects");
  const project = projectsData.find((p) => p.slug === slug && p.published !== false);

  if (!project) return notFound();

  const title = locale === "ar" ? project.title_ar : project.title_en;
  const desc = locale === "ar" ? project.desc_ar : project.desc_en;

  return (
    <article className="min-h-screen pb-20 bg-background text-foreground selection:bg-primary/20">
      <StructuredData
        type="CreativeWork"
        data={{
          title,
          description: desc,
          image: project.cover_image || "",
          url: `https://ahmedlotfy.site/${locale}/projects/${slug}`,
          authorName: "Ahmed Lotfy",
          authorUrl: "https://ahmedlotfy.site",
          keywords: project.categories?.join(", ") || "",
          categories: project.categories || [],
          language: locale === "ar" ? "ar" : "en",
        }}
      />

      <BreadcrumbSchema
        items={[
          { label: "Home", url: `/${locale}` },
          { label: "Projects", url: `/${locale}/projects` },
          { label: title, url: `/${locale}/projects/${slug}` },
        ]}
      />

      <div className="container mx-auto px-4 md:px-6 pt-24 md:pt-32">
        <BackButton
          href={`/${locale}/projects`}
          label={locale === "ar" ? "رجوع للمشاريع" : "Back to Projects"}
          locale={locale}
        />
      </div>

      {project.cover_image && (
        <div className="mb-12 md:mb-16 container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.cover_image}
              alt={title}
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-8 md:space-y-12 mb-20 text-start md:text-center px-4">
        <div className="space-y-6">
          <div className="flex flex-wrap gap-3 md:justify-center mb-6">
            {project.categories?.map((cat, i) => (
              <span key={i} className="px-4 py-1.5 bg-secondary/30 backdrop-blur-md border border-white/10 rounded-full text-sm font-medium text-foreground capitalize shadow-sm">
                {cat}
              </span>
            ))}
          </div>

          <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight bg-clip-text text-transparent bg-linear-to-b from-foreground to-foreground/70">
            {title}
          </h1>
        </div>

        <p className="text-md md:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
          {desc}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center pt-4">
          {project.live_link && (
            <Button asChild size="lg" className="rounded-full text-md h-12 px-8 shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-1">
              <a href={project.live_link} target="_blank">
                <ExternalLink className="w-5 h-5 me-2.5" /> {t("visit_live_site")}
              </a>
            </Button>
          )}
          {project.repo_link && (
            <Button asChild variant="outline" size="lg" className="rounded-full text-md h-12 px-8 backdrop-blur-sm border-white/10 hover:bg-secondary/10 transition-all hover:-translate-y-1">
              <a href={project.repo_link} target="_blank">
                <IoLogoGithub className="w-5 h-5 me-2.5" /> {t("view_code")}
              </a>
            </Button>
          )}
        </div>
      </div>

      <div className="mt-32 pt-12 border-t border-border/20 text-center pb-8">
        <Link href={`/${locale}/projects`} className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium tracking-widest uppercase hover:underline underline-offset-4">
          {locale === "ar" ? "شوف كل المشاريع" : "View All Projects"}
        </Link>
      </div>
    </article>
  );
}
