import { getBlogPostsPaginatedByLocale, getBlogTagsByLocale } from "@/src/lib/blog";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/src/i18n/routing";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Metadata } from "next";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  const baseUrl = "https://ahmedlotfy.site";

  return {
    title: `${t("title")} — Ahmed Lotfy Blog`,
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${baseUrl}/${locale}/blogs`,
      siteName: "Ahmed Lotfy Portfolio",
      locale: locale === "ar" ? "ar_EG" : "en_US",
      type: "website",
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: t("title"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      creator: "@ahmedlotfy_dev",
      images: [`${baseUrl}/og-image.png`],
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/blogs`,
      languages: {
        en: `${baseUrl}/en/blogs`,
        ar: `${baseUrl}/ar/blogs`,
        "x-default": `${baseUrl}/en/blogs`,
      },
    },
  } satisfies Metadata;
}

export default async function BlogIndexPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { page: pageParam } = await searchParams;
  const t = await getTranslations("blog");
  const currentPage = Math.max(1, parseInt(pageParam || "1", 10) || 1);
  const pageSize = 6;
  const { posts, totalPages } = getBlogPostsPaginatedByLocale(locale, currentPage, pageSize);
  const tags = getBlogTagsByLocale(locale);
  const isArabic = locale === "ar";

  return (
    <main className="min-h-screen pb-20 bg-background overflow-x-hidden">
      <div className="container mx-auto mt-24 max-w-6xl px-4 md:mt-32 md:px-6">
        {/* Header */}
        <header className="mb-16 text-center">
          <p className="mb-4 inline-flex rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium uppercase tracking-wide text-primary">
            {isArabic ? "مقالات" : "Articles"}
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl">
            {t("title")}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            {t("description")}
          </p>
        </header>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mb-12 flex flex-wrap justify-center gap-2">
            {tags.slice(0, 12).map(({ tag, count }) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-card/30 px-3 py-1 text-xs font-medium text-muted-foreground"
              >
                {tag}
                <span className="text-[10px] text-muted-foreground/60">
                  {count}
                </span>
              </span>
            ))}
          </div>
        )}

        {/* Posts Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm transition-all hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
            >
              {post.image && (
                <Link
                  href={`/${locale}/blogs/${post.slug}`}
                  className="block aspect-video overflow-hidden"
                >
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={600}
                    height={340}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>
              )}
              <div className="flex flex-1 flex-col p-5">
                <div className="mb-3 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(post.date).toLocaleDateString(
                      isArabic ? "ar-EG" : "en-US",
                      { year: "numeric", month: "short", day: "numeric" }
                    )}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.readingTime.text}
                  </span>
                </div>
                <Link
                  href={`/${locale}/blogs/${post.slug}`}
                  className="group/title"
                >
                  <h2 className="mb-2 text-lg font-bold leading-snug text-foreground transition-colors group-hover/title:text-primary line-clamp-2">
                    {post.title}
                  </h2>
                </Link>
                <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-secondary/30 px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/${locale}/blogs/${post.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:gap-2 transition-all"
                  >
                    {isArabic ? "اقرأ" : "Read"}
                    <ArrowRight
                      className={`h-3 w-3 ${isArabic ? "rotate-180" : ""}`}
                    />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="mt-12 flex items-center justify-center gap-2">
            {currentPage > 1 && (
              <Link
                href={`/${locale}/blogs?page=${currentPage - 1}`}
                className="rounded-lg border border-border/50 bg-card/30 px-4 py-2 text-sm font-medium text-foreground hover:border-primary/30 transition-colors"
              >
                {isArabic ? "السابق" : "Previous"}
              </Link>
            )}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (page) => (
                <Link
                  key={page}
                  href={`/${locale}/blogs?page=${page}`}
                  className={`h-9 w-9 rounded-lg text-sm font-medium transition-colors ${
                    page === currentPage
                      ? "bg-primary text-primary-foreground"
                      : "border border-border/50 bg-card/30 text-foreground hover:border-primary/30"
                  } flex items-center justify-center`}
                >
                  {page}
                </Link>
              )
            )}
            {currentPage < totalPages && (
              <Link
                href={`/${locale}/blogs?page=${currentPage + 1}`}
                className="rounded-lg border border-border/50 bg-card/30 px-4 py-2 text-sm font-medium text-foreground hover:border-primary/30 transition-colors"
              >
                {isArabic ? "التالي" : "Next"}
              </Link>
            )}
          </nav>
        )}
      </div>
    </main>
  );
}
