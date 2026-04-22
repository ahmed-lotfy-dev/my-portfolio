import { getDbBlogPosts, getLatestSyncDate } from "@/src/app/actions/posts/queries";
import { BlogCard } from "@/src/components/features/blog/BlogCard";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Badge } from "@/src/components/ui/badge";
import { Tag, RefreshCw, Star } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.blogs" });
  const baseUrl = "https://ahmedlotfy.site";

  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${baseUrl}/${locale}/blogs`,
      siteName: "Ahmed Shoman Portfolio",
      locale: locale === "ar" ? "ar_EG" : "en_US",
      type: "website",
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/blogs`,
      languages: {
        en: `${baseUrl}/en/blogs`,
        ar: `${baseUrl}/ar/blogs`,
      },
      xDefault: `${baseUrl}/en/blogs`,
    },
  };
}

export default async function PostsList(props: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; tag?: string; featured?: string }>;
}) {
  const { locale } = await props.params;
  const { category, tag, featured } = await props.searchParams;
  const isFeaturedOnly = featured === "true";

  const [filteredPosts, syncDate, allPosts] = await Promise.all([
    getDbBlogPosts({
      category,
      tag,
      featuredOnly: isFeaturedOnly
    }),
    getLatestSyncDate(),
    getDbBlogPosts(),
  ]);

  const categories = Array.from(new Set(allPosts.map((p) => p.category))).sort() as string[];

  const activeFilter = isFeaturedOnly ? "featured" : (category || (tag ? `#${tag}` : null));

  return (
    <div className="container mx-auto px-4 mt-28 max-w-6xl pb-20">
      <div className="flex flex-col items-center mb-12 text-center">
        <h1 className="mb-4 bg-linear-to-r from-primary via-primary-light to-primary-dark bg-clip-text text-5xl font-extrabold tracking-tight text-transparent">
          Obsidian Notes & Blog
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Insights, guides, and notes synced directly from my Obsidian vault.
          Covering DevOps, Linux, and Software Development.
        </p>
        {syncDate && (
          <div className="mt-4 flex items-center justify-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
            <RefreshCw className="w-3 h-3 animate-spin-slow" />
            <span>Synced {formatDistanceToNow(new Date(syncDate), { addSuffix: true })}</span>
          </div>
        )}
      </div>

      {/* Filter Navigation */}
      <div className="mb-12">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            asChild
            variant={!activeFilter ? "default" : "outline"}
            size="sm"
            className="rounded-full px-6"
          >
            <Link href={`/${locale}/blogs`}>All Posts</Link>
          </Button>
          <Button
            asChild
            variant={isFeaturedOnly ? "default" : "outline"}
            size="sm"
            className="rounded-full border-primary/25 px-6 hover:bg-primary/10"
          >
            <Link href={`/${locale}/blogs?featured=true`} className="flex items-center gap-2">
              <Star className={`h-3.5 w-3.5 ${isFeaturedOnly ? "fill-primary-foreground" : "fill-primary text-primary"}`} />
              Featured
            </Link>
          </Button>
          {categories.map((cat: string) => (
            <Button
              key={cat}
              asChild
              variant={category === cat ? "default" : "outline"}
              size="sm"
              className="rounded-full px-6"
            >
              <Link href={`/${locale}/blogs?category=${encodeURIComponent(cat)}`}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Link>
            </Button>
          ))}
        </div>

        {tag && (
          <div className="mt-6 flex justify-center">
            <Badge variant="secondary" className="px-4 py-1.5 flex items-center gap-2 text-sm">
              <Tag className="w-3.5 h-3.5" />
              Showing posts tagged: <span className="font-bold">#{tag}</span>
              <Link href={`/${locale}/blogs`} className="ml-1 hover:text-primary transition-colors">✕</Link>
            </Badge>
          </div>
        )}
      </div>

      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <BlogCard key={post.slug} post={post} locale={locale} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border-2 border-dashed border-border bg-card/40 py-32 text-center">
          <p className="text-2xl font-medium text-muted-foreground">No matching notes found</p>
          <p className="mt-2 text-muted-foreground">Try clearing the filters to see all content.</p>
          <Button asChild variant="link" className="mt-4">
            <Link href={`/${locale}/blogs`}>Clear all filters</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
