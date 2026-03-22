import { getDbBlogPosts } from "@/src/app/actions/posts/queries";
import { BlogCard } from "@/src/components/features/blog/BlogCard";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";

interface RelatedPostsProps {
  currentSlug: string;
  category: string;
  locale: string;
}

export async function RelatedPosts({ currentSlug, category, locale }: RelatedPostsProps) {
  const allRelated = await getDbBlogPosts({ category });

  // Filter out current post and take top 3
  const relatedPosts = allRelated
    .filter((p) => p.slug !== currentSlug)
    .slice(0, 3);

  if (relatedPosts.length === 0) return null;

  return (
    <section className="mt-24 mb-10 border-t border-dashed border-border pt-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="bg-linear-to-r from-primary via-primary-light to-primary-dark bg-clip-text text-2xl font-bold text-transparent">
          More Like This
        </h2>
        <Button asChild variant="link" className="text-primary p-0 h-auto">
          <Link href={`/${locale}/blogs?category=${encodeURIComponent(category)}`}>View All in {category} →</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedPosts.map((post) => (
          <BlogCard key={post.slug} post={post} locale={locale} />
        ))}
      </div>
    </section>
  );
}
