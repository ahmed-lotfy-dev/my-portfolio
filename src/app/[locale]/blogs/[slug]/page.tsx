import { getDbBlogPostBySlug } from "@/src/app/actions/posts/queries";
import MDXContent from "@/src/components/features/blog/MDXContent";
import { Badge } from "@/src/components/ui/badge";
import { Calendar, Clock, ChevronLeft, Share2, Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { RelatedPosts } from "@/src/components/features/blog/RelatedPosts";
import { BlogViewTracker } from "@/src/components/analytics/BlogViewTracker";
import StructuredData from "@/src/components/seo/StructuredData";
import { BreadcrumbSchema } from "@/src/components/seo/BreadcrumbSchema";
import { buildBlogCategoryPath } from "@/src/lib/utils/blog-taxonomy";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

function truncateToWord(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  return lastSpace > maxLength * 0.7 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = await getDbBlogPostBySlug(slug, locale);
  const baseUrl = "https://ahmedlotfy.site";

  if (!post) {
    return {
      title: "Post Not Found | Ahmed Lotfy Blog",
      robots: { index: false, follow: false },
    };
  }

  const description = truncateToWord(post.content.replace(/[#*`_\[\]()]/g, '').replace(/\n+/g, ' ').trim(), 160);

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
      images: [
        {
          url: post.imageLink || `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      creator: "@ahmedlotfy_dev",
      images: [post.imageLink || `${baseUrl}/og-image.png`],
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/blogs/${slug}`,
      languages: {
        en: `${baseUrl}/en/blogs/${slug}`,
        ar: `${baseUrl}/ar/blogs/${slug}`,
        "x-default": `${baseUrl}/en/blogs/${slug}`,
      },
    },
  };
}

export default async function SinglePost(props: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const params = await props.params;
  const { locale, slug } = params;
  const post = await getDbBlogPostBySlug(slug, locale);

  const t = await getTranslations({ locale, namespace: "blog_page" });

  if (!post) {
    notFound();
  }

  const baseUrl = "https://ahmedlotfy.site";
  const localePath = `/${locale}/blogs/${slug}`;
  const publishedDate = new Date(post.date);
  const modifiedDate = post.updated ? new Date(post.updated) : publishedDate;

  return (
    <article className="min-h-screen pt-32 pb-20 px-4">
      <BlogViewTracker
        blogId={post.slug}
        blogTitle={post.title}
        categories={[post.category, ...post.tags]}
      />
      <StructuredData
        type="Article"
        data={{
          title: post.title,
          description: truncateToWord(post.content.replace(/[#*`_\[\]()]/g, '').replace(/\n+/g, ' ').trim(), 160),
          image: post.imageLink || `${baseUrl}/og-image.png`,
          publishedDate: publishedDate.toISOString(),
          modifiedDate: modifiedDate.toISOString(),
          authorName: 'Ahmed Lotfy',
          authorUrl: baseUrl,
          keywords: `${post.category}, ${post.tags.join(', ')}`,
          categories: [post.category],
          language: locale === 'ar' ? 'ar' : 'en',
          url: `${baseUrl}${localePath}`,
        }}
      />
      <BreadcrumbSchema
        items={[
          { label: 'Home', url: `/${locale}` },
          { label: 'Blogs', url: `/${locale}/blogs` },
          { label: post.title, url: localePath },
        ]}
      />
     <div className="max-w-4xl mx-auto">
        <Link
          href={`/${locale}/blogs`}
          className="group mb-8 inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <ChevronLeft className="w-4 h-4 mr-1 transform group-hover:-translate-x-1 transition-transform" />
          {t("back_to_all_posts")}
        </Link>

        <header className="mb-12">
          <Link href={buildBlogCategoryPath(locale, post.category)}>
            <Badge variant="secondary" className="mb-6 uppercase tracking-wider text-[10px] font-bold py-1 px-3 hover:bg-primary hover:text-white transition-colors cursor-pointer">
              {post.category}
            </Badge>
          </Link>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-8 leading-[1.1]">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 border-y border-border py-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <time dateTime={post.date}>{post.date}</time>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{post.readingTime.replace(" min read", "")} {t("min_read")}</span>
            </div>
            <div className="flex items-center gap-2 text-primary/80">
              <Eye className="w-4 h-4" />
              <span>{post.views || 0} {t("views")}</span>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>

        <div className="relative">
          <MDXContent content={post.content} />
        </div>

        <footer className="mt-20 border-t border-border pt-10">
          <nav aria-label="Tags" className="flex flex-wrap gap-3">
            {post.tags.map((tag) => (
              <Link key={tag} href={`/${locale}/blogs?tag=${encodeURIComponent(tag)}`}>
                <Badge variant="outline" className="cursor-pointer bg-card px-3 py-1 text-xs transition-all hover:bg-primary/10 hover:text-primary">
                  #{tag}
                </Badge>
              </Link>
            ))}
          </nav>

          {post.updated && (
            <time dateTime={post.updated} className="mt-8 block text-xs italic text-muted-foreground">
              {t("last_updated_on")} {post.updated}
            </time>
          )}
        </footer>

        <RelatedPosts currentSlug={slug} category={post.category} locale={locale} />
      </div>
    </article>
  );
}
