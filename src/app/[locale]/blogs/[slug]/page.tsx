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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = await getDbBlogPostBySlug(slug);
  const baseUrl = "https://ahmedlotfy.site";

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post.content.substring(0, 160),
    openGraph: {
      title: post.title,
      description: post.content.substring(0, 160),
      url: `${baseUrl}/${locale}/blogs/${slug}`,
      siteName: "Ahmed Shoman Portfolio",
      locale: locale === "ar" ? "ar_EG" : "en_US",
      type: "article",
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/blogs/${slug}`,
      languages: {
        en: `${baseUrl}/en/blogs/${slug}`,
        ar: `${baseUrl}/ar/blogs/${slug}`,
      },
      xDefault: `${baseUrl}/en/blogs/${slug}`,
    },
  };
}

export default async function SinglePost(props: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const params = await props.params;
  const { locale, slug } = params;
  const post = await getDbBlogPostBySlug(slug);

   if (!post) {
     return (
       <div className="flex flex-col items-center justify-center h-screen pt-20">
         <h1 className="text-4xl font-bold">Post Not Found</h1>
         <Button asChild className="mt-8" variant="outline">
           <Link href={`/${locale}/blogs`}>Back to Blog</Link>
         </Button>
       </div>
     );
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
       {/* Article Structured Data */}
       <StructuredData
         type="Article"
         data={{
           title: post.title,
           description: post.content.substring(0, 160),
           image: post.imageLink || `${baseUrl}/og-image.png`,
           publishedDate: publishedDate.toISOString(),
           modifiedDate: modifiedDate.toISOString(),
           authorName: 'Ahmed Shoman',
           authorUrl: baseUrl,
           keywords: `${post.category}, ${post.tags.join(', ')}`,
           categories: [post.category],
           language: locale === 'ar' ? 'ar' : 'en',
         }}
       />
       {/* Breadcrumb Structured Data */}
       <BreadcrumbSchema
         items={[
           { label: 'Home', url: `/${locale}` },
           { label: 'Blogs', url: `/${locale}/blogs` },
           { label: post.title, url: `/${locale}/blogs/${slug}` },
         ]}
       />
      <div className="max-w-4xl mx-auto">
        <Link
          href={`/${locale}/blogs`}
          className="group mb-8 inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <ChevronLeft className="w-4 h-4 mr-1 transform group-hover:-translate-x-1 transition-transform" />
          Back to all posts
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

        <footer className="mt-20 border-t border-border pt-10">
          <div className="flex flex-wrap gap-3">
            {post.tags.map((tag) => (
              <Link key={tag} href={`/${locale}/blogs?tag=${encodeURIComponent(tag)}`}>
                <Badge variant="outline" className="cursor-pointer bg-card px-3 py-1 text-xs transition-all hover:bg-primary/10 hover:text-primary">
                  #{tag}
                </Badge>
              </Link>
            ))}
          </div>

          {post.updated && (
            <p className="mt-8 text-xs italic text-muted-foreground">
              Last updated on {post.updated}
            </p>
          )}
        </footer>

        <RelatedPosts currentSlug={slug} category={post.category} locale={locale} />
      </div>
    </article>
  );
}
