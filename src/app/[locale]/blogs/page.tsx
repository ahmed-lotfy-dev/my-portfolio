import { getDbBlogPosts } from "@/src/app/actions/postsActions";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Badge } from "@/src/components/ui/badge";
import { Calendar, Clock, Tag } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.blogs" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function PostsList(props: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; tag?: string }>;
}) {
  const { category, tag } = await props.searchParams;

  // Fetch from DB with filters
  const filteredPosts = await getDbBlogPosts({ category, tag });

  // Get all categories for filter UI (could be optimized with a separate db call)
  const allPosts = await getDbBlogPosts();
  const categories = Array.from(new Set(allPosts.map((p) => p.category))).sort();

  const activeFilter = category || (tag ? `#${tag}` : null);

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
            <Card
              key={post.slug}
              className="group flex flex-col h-full overflow-hidden border-none shadow-md hover:shadow-2xl transition-all duration-500 bg-white dark:bg-gray-900/50 backdrop-blur-sm"
            >
              <Link href={`/blogs/${post.slug}`} className="block relative overflow-hidden h-48 bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                <CardHeader className="p-0 h-full flex items-center justify-center">
                  {post.image ? (
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />
                  ) : (
                    <>
                      <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] bg-size-[20px_20px]" />
                      </div>
                      <div className="z-10 text-center p-6">
                        <div className="inline-block p-3 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm mb-3">
                          <Tag className="w-6 h-6 text-primary" />
                        </div>
                        <Badge variant="outline" className="text-xs uppercase tracking-widest font-bold">
                          {post.category}
                        </Badge>
                      </div>
                    </>
                  )}
                </CardHeader>
              </Link>

              <CardContent className="p-6 grow flex flex-col">
                <CardTitle className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  <Link href={`/blogs/${post.slug}`} className="hover:underline">
                    {post.title}
                  </Link>
                </CardTitle>

                <div className="flex items-center gap-4 text-xs text-gray-500 mb-6 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {post.readingTime}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mt-auto">
                  {post.tags.slice(0, 3).map((t) => (
                    <Link
                      key={t}
                      href={`/blogs?tag=${t}`}
                      className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-300"
                    >
                      #{t}
                    </Link>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="p-6 pt-0">
                <Button asChild className="w-full group/btn relative overflow-hidden" variant="ghost">
                  <Link href={`/blogs/${post.slug}`} className="flex items-center justify-between w-full">
                    <span className="font-bold">Read Full Post</span>
                    <span className="transform group-hover/btn:translate-x-1 transition-transform">→</span>
                  </Link>
                </Button>
              </CardFooter>
            </Card>
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
