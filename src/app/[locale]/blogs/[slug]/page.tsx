import { getBlogPost, getAllBlogPosts, getRelatedPosts } from "@/src/lib/blog";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/src/i18n/routing";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowLeft, Share2, Tag } from "lucide-react";
import { Metadata } from "next";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";


function rehypeStripEventHandlers() {
  return (tree: any) => {
    const visit = (node: any) => {
      if (node.properties) {
        for (const key of Object.keys(node.properties)) {
          if (key.startsWith("on")) {
            delete node.properties[key];
          }
        }
      }
      if (node.children) {
        node.children.forEach(visit);
      }
    };
    visit(tree);
  };
}
import StructuredData from "@/src/components/seo/StructuredData";
import { BreadcrumbSchema } from "@/src/components/seo/BreadcrumbSchema";


export async function generateStaticParams() {
  const posts = getAllBlogPosts();
  const params: { locale: string; slug: string }[] = [];

  for (const locale of routing.locales) {
    for (const post of posts) {
      params.push({ locale, slug: post.slug });
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Post Not Found" };

  const baseUrl = "https://ahmedlotfy.site";
  const description = post.excerpt.replace(/[#*`\[\]\(\)!>|_\-\n]/g, "").slice(0, 160);

  return {
    title: post.title,
    description,
    openGraph: {
      title: post.title,
      description,
      url: `${baseUrl}/${locale}/blogs/${slug}`,
      siteName: "Ahmed Lotfy Portfolio",
      locale: locale === "ar" ? "ar_EG" : "en_US",
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.date,
      authors: ["Ahmed Lotfy"],
      tags: post.tags,
      images: post.image
        ? [{ url: post.image, width: 1200, height: 630, alt: post.title }]
        : [{ url: `${baseUrl}/og-image.png`, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      creator: "@ahmedlotfy_dev",
      images: post.image ? [post.image] : [`${baseUrl}/og-image.png`],
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/blogs/${slug}`,
      languages: {
        en: `${baseUrl}/en/blogs/${slug}`,
        ar: `${baseUrl}/ar/blogs/${slug}`,
        "x-default": `${baseUrl}/en/blogs/${slug}`,
      },
    },
  } satisfies Metadata;
}

async function markdownToHtml(content: string): Promise<string> {
  const result = await remark()
    .use(remarkGfm, { singleTilde: false })
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      behavior: "wrap",
      properties: { className: ["anchor"] },
    })
    .use(rehypeStripEventHandlers)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(content);

  return result.toString();
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("blog");
  const post = getBlogPost(slug);

  if (!post) return notFound();

  const isArabic = locale === "ar";
  const contentHtml = await markdownToHtml(post.content);
  const relatedPosts = getRelatedPosts(slug, 3);
  const baseUrl = "https://ahmedlotfy.site";

  return (
    <main className="min-h-screen pb-20">
      <StructuredData
        type="BlogPosting"
        data={{
          title: post.title,
          description: post.excerpt.replace(/[#*`\[\]\(\)!>|_\-\n]/g, "").slice(0, 160),
          authorName: "Ahmed Lotfy",
          authorUrl: baseUrl,
          datePublished: post.date,
          dateModified: post.date,
          image: post.image || `${baseUrl}/og-image.png`,
          url: `${baseUrl}/${locale}/blogs/${slug}`,
          keywords: post.tags.join(", "),
          language: locale,
        }}
      />

      <BreadcrumbSchema
        items={[
          { label: isArabic ? "الرئيسية" : "Home", url: `/${locale}` },
          { label: isArabic ? "المدونة" : "Blog", url: `/${locale}/blogs` },
          { label: post.title, url: `/${locale}/blogs/${slug}` },
        ]}
      />

      <div className="pt-24 md:pt-32">
        <Link
          href={`/${locale}/blogs`}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className={`h-4 w-4 ${isArabic ? "" : "rotate-180"}`} />
          {isArabic ? "العودة للمدونة" : "Back to Blog"}
        </Link>
      </div>

      <article className="mx-auto max-w-4xl px-4 md:px-6">
        {/* Header */}
        <header className="mb-12 text-center">
          <div className="mb-4 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
            <time
              dateTime={post.date}
              className="inline-flex items-center gap-1.5"
            >
              <Calendar className="h-4 w-4" />
              {new Date(post.date).toLocaleDateString(
                isArabic ? "ar-EG" : "en-US",
                { year: "numeric", month: "long", day: "numeric" }
              )}
            </time>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {post.readingTime.text}
            </span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight leading-tight md:text-5xl">
            {post.title}
          </h1>

          {post.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary"
                >
                  <Tag className="h-3 w-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {post.share && (
            <div className="mt-6">
              <button
                className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-card/30 px-4 py-2 text-xs font-medium text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors"
              >
                <Share2 className="h-3.5 w-3.5" />
                {isArabic ? "نسخ الرابط" : "Copy Link"}
              </button>
            </div>
          )}
        </header>

        {/* Cover Image */}
        {post.image && (
          <figure className="mb-12 overflow-hidden rounded-2xl border border-border/30">
            <Image
              src={post.image}
              alt={post.title}
              width={1200}
              height={630}
              className="w-full h-auto object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 900px"
            />
          </figure>
        )}

        {/* Content */}
        <div
          className="prose prose-lg dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="mt-16 border-t border-border/30 pt-12">
            <h2 className="mb-8 text-2xl font-bold text-center">
              {isArabic ? "مقالات ذات صلة" : "Related Articles"}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((related) => (
                <Link
                  key={related.slug}
                  href={`/${locale}/blogs/${related.slug}`}
                  className="group flex flex-col overflow-hidden rounded-xl border border-border/50 bg-card/30 p-5 transition-all hover:border-primary/30 hover:shadow-lg"
                >
                  <h3 className="mb-2 text-sm font-bold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                    {related.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {related.excerpt.slice(0, 100)}
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-[10px] text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {new Date(related.date).toLocaleDateString(
                      isArabic ? "ar-EG" : "en-US",
                      { month: "short", day: "numeric" }
                    )}
                    <span className="text-muted-foreground/50">·</span>
                    {related.readingTime.text}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="mt-12 border-t border-border/30 pt-8 text-center">
          <Link
            href={`/${locale}/blogs`}
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className={`h-4 w-4 ${isArabic ? "" : "rotate-180"}`} />
            {isArabic ? "العودة للمدونة" : "Back to Blog"}
          </Link>
        </footer>
      </article>
    </main>
  );
}
