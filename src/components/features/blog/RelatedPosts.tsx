import { getDbBlogPosts } from "@/src/app/actions/postsActions";
import { BlogCard } from "@/src/components/features/blog/BlogCard";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";

interface RelatedPostsProps {
  currentSlug: string;
  category: string;
}

export async function RelatedPosts({ currentSlug, category }: RelatedPostsProps) {
  const allRelated = await getDbBlogPosts({ category });

  // Filter out current post and take top 3
  const relatedPosts = allRelated
    .filter((p) => p.slug !== currentSlug)
    .slice(0, 3);

  if (relatedPosts.length === 0) return null;

  return (
    <section className="mt-24 mb-10 border-t border-dashed border-gray-200 dark:border-gray-800 pt-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold bg-linear-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          More Like This
        </h2>
        <Button asChild variant="link" className="text-primary p-0 h-auto">
          <Link href={`/blogs?category=${category}`}>View All in {category} →</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedPosts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
