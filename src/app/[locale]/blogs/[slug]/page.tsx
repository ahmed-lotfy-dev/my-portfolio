import { getDbBlogPostBySlug } from "@/src/app/actions/postsActions";
import MDXContent from "@/src/components/features/blog/MDXContent";
import { Badge } from "@/src/components/ui/badge";
import { Calendar, Clock, ChevronLeft, Share2, Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { RelatedPosts } from "@/src/components/features/blog/RelatedPosts";
import { BlogViewTracker } from "@/src/components/analytics/BlogViewTracker";

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
      <BlogViewTracker
        blogId={post.slug}
        blogTitle={post.title}
        categories={[post.category, ...post.tags]}
      />
      <div className="max-w-4xl mx-auto">
        <Link
          href="/blogs"
          className="inline-flex items-center text-sm text-gray-500 hover:text-primary transition-colors mb-8 group"
        >
          <ChevronLeft className="w-4 h-4 mr-1 transform group-hover:-translate-x-1 transition-transform" />
          Back to all posts
        </Link>

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
            <div className="flex items-center gap-2 text-primary/80">
              <Eye className="w-4 h-4" />
              <span>{post.views || 0} views</span>
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

        <RelatedPosts currentSlug={slug} category={post.category} />
      </div>
    </article>
  );
}
