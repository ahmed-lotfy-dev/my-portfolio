import { BlogCard } from "@/src/components/features/blog/BlogCard";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Badge } from "@/src/components/ui/badge";
import { Tag, RefreshCw, Star } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

// ... (existing metadata code)

export default async function PostsList(props: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; tag?: string; featured?: string }>;
}) {
  const { category, tag, featured } = await props.searchParams;
  const isFeaturedOnly = featured === "true";

  // Fetch from DB with filters
  const filteredPosts = await getDbBlogPosts({
    category,
    tag,
    featuredOnly: isFeaturedOnly
  });
  const syncDate = await getLatestSyncDate();

  // Get all categories for filter UI
  const allPosts = await getDbBlogPosts();
  const categories = Array.from(new Set(allPosts.map((p) => p.category))).sort();

  const activeFilter = isFeaturedOnly ? "featured" : (category || (tag ? `#${tag}` : null));

  return (
    <div className="container mx-auto px-4 mt-28 max-w-6xl pb-20">
      <div className="flex flex-col items-center mb-12 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight mb-4 bg-linear-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          Obsidian Notes & Blog
        </h1>
        <p className="text-gray-500 max-w-2xl text-lg">
          Insights, guides, and notes synced directly from my Obsidian vault.
          Covering DevOps, Linux, and Software Development.
        </p>
        {syncDate && (
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400 font-medium bg-gray-50 dark:bg-gray-900/50 px-3 py-1 rounded-full border border-gray-100 dark:border-gray-800">
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
            <Link href="/blogs">All Posts</Link>
          </Button>
          <Button
            asChild
            variant={isFeaturedOnly ? "default" : "outline"}
            size="sm"
            className="rounded-full px-6 border-amber-200 dark:border-amber-900/50 hover:bg-amber-50 dark:hover:bg-amber-900/20"
          >
            <Link href="/blogs?featured=true" className="flex items-center gap-2">
              <Star className={`w-3.5 h-3.5 ${isFeaturedOnly ? "fill-white" : "text-amber-500 fill-amber-500"}`} />
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
              <Link href={`/blogs?category=${cat}`}>
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
              <Link href="/blogs" className="ml-1 hover:text-primary transition-colors">✕</Link>
            </Badge>
          </div>
        )}
      </div>

      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-32 bg-gray-50 dark:bg-gray-800/10 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800">
          <p className="text-2xl font-medium text-gray-400">No matching notes found</p>
          <p className="text-gray-500 mt-2">Try clearing the filters to see all content.</p>
          <Button asChild variant="link" className="mt-4">
            <Link href="/blogs">Clear all filters</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
