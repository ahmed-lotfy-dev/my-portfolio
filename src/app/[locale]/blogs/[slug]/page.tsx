import { getDbBlogPostBySlug } from "@/src/app/actions/postsActions";
import MDXContent from "@/src/components/features/blog/MDXContent";
import { Badge } from "@/src/components/ui/badge";
import { Calendar, Clock, ChevronLeft, Share2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getDbBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post.content.substring(0, 160),
  };
}

export default async function SinglePost(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const { slug } = params;
  const post = await getDbBlogPostBySlug(slug);

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center h-screen pt-20">
        <h1 className="text-4xl font-bold">Post Not Found</h1>
        <Button asChild className="mt-8" variant="outline">
          <Link href="/blogs">Back to Blog</Link>
        </Button>
      </div>
    );
  }

  return (
    <article className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <Link
          href="/blogs"
          className="inline-flex items-center text-sm text-gray-500 hover:text-primary transition-colors mb-8 group"
        >
          <ChevronLeft className="w-4 h-4 mr-1 transform group-hover:-translate-x-1 transition-transform" />
          Back to all posts
        </Link>

        {/* Header */}
        <header className="mb-12">
          <Link href={`/blogs?category=${post.category}`}>
            <Badge variant="secondary" className="mb-6 uppercase tracking-wider text-[10px] font-bold py-1 px-3 hover:bg-primary hover:text-white transition-colors cursor-pointer">
              {post.category}
            </Badge>
          </Link>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-8 leading-[1.1]">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 border-y border-gray-100 dark:border-gray-800 py-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <time dateTime={post.date}>{post.date}</time>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{post.readingTime}</span>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="relative">
          <MDXContent content={post.content} />
        </div>

        {/* Footer info */}
        <footer className="mt-20 pt-10 border-t border-gray-100 dark:border-gray-800">
          <div className="flex flex-wrap gap-3">
            {post.tags.map((tag) => (
              <Link key={tag} href={`/blogs?tag=${tag}`}>
                <Badge variant="outline" className="text-xs bg-gray-50 dark:bg-gray-900 px-3 py-1 hover:bg-primary/10 hover:text-primary transition-all cursor-pointer">
                  #{tag}
                </Badge>
              </Link>
            ))}
          </div>

          {post.updated && (
            <p className="mt-8 text-xs text-gray-400 italic">
              Last updated on {post.updated}
            </p>
          )}
        </footer>

        {/* Related Posts Section */}
        <RelatedPosts currentSlug={slug} category={post.category} />
      </div>
    </article>
  );
}

import { getDbBlogPosts } from "@/src/app/actions/postsActions";
import { BlogCard } from "@/src/components/features/blog/BlogCard";

async function RelatedPosts({ currentSlug, category }: { currentSlug: string; category: string }) {
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
