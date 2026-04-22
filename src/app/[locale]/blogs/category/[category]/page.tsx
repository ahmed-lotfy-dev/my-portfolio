import { getDbBlogCategoryBySlug, getDbBlogPosts } from "@/src/app/actions/posts/queries";
import { BlogCard } from "@/src/components/features/blog/BlogCard";
import { BreadcrumbSchema } from "@/src/components/seo/BreadcrumbSchema";
import StructuredData from "@/src/components/seo/StructuredData";
import { Button } from "@/src/components/ui/button";
import { buildBlogCategoryPath } from "@/src/lib/utils/blog-taxonomy";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category: categorySlug } = await params;
  const category = await getDbBlogCategoryBySlug(categorySlug);
  const baseUrl = "https://ahmedlotfy.site";

  if (!category) {
    return {
      title: "Category Not Found",
    };
  }

  const title =
    locale === "ar"
      ? `${category.name} - تدوينات`
      : `${category.name} Articles`;
  const description =
    locale === "ar"
      ? `تصفح المقالات والملاحظات المرتبطة بتصنيف ${category.name}.`
      : `Browse notes, guides, and articles filed under ${category.name}.`;
  const categoryPath = buildBlogCategoryPath(locale, category.name);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}${categoryPath}`,
      siteName: "Ahmed Shoman Portfolio",
      locale: locale === "ar" ? "ar_EG" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@ahmedlotfy_dev",
    },
    alternates: {
      canonical: `${baseUrl}${categoryPath}`,
      languages: {
        en: `${baseUrl}${buildBlogCategoryPath("en", category.name)}`,
        ar: `${baseUrl}${buildBlogCategoryPath("ar", category.name)}`,
      },
      xDefault: `${baseUrl}${buildBlogCategoryPath("en", category.name)}`,
    },
  };
}

export default async function BlogCategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category: categorySlug } = await params;
  setRequestLocale(locale);

  const category = await getDbBlogCategoryBySlug(categorySlug);
  if (!category) {
    notFound();
  }

  const posts = await getDbBlogPosts({ category: category.name });
  if (posts.length === 0) {
    notFound();
  }

  const title = locale === "ar" ? `تصنيف ${category.name}` : `${category.name} Articles`;

  return (
    <main className="container mx-auto mt-28 max-w-6xl px-4 pb-20">
      <StructuredData
        type="CollectionPage"
        data={{
          name: `${category.name} Articles - Ahmed Shoman`,
          description:
            locale === "ar"
              ? `صفحة أرشيف تجمع المقالات الموجودة تحت تصنيف ${category.name}.`
              : `Archive page for articles and notes in the ${category.name} category.`,
          url: `https://ahmedlotfy.site${buildBlogCategoryPath(locale, category.name)}`,
          numberOfItems: posts.length,
        }}
      />
      <BreadcrumbSchema
        items={[
          { label: locale === "ar" ? "الرئيسية" : "Home", url: `/${locale}` },
          { label: locale === "ar" ? "المدونة" : "Blog", url: `/${locale}/blogs` },
          { label: category.name, url: buildBlogCategoryPath(locale, category.name) },
        ]}
      />

      <header className="mb-12 text-center">
        <p className="mb-4 inline-flex rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium uppercase tracking-wide text-primary">
          {locale === "ar" ? "تصنيف" : "Category"}
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">{title}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          {locale === "ar"
            ? `مقالات وملاحظات مرتبة تحت تصنيف ${category.name}، مع صفحات ثابتة أوضح لمحركات البحث من الفلاتر المعتمدة على query params.`
            : `Articles and notes filed under ${category.name}, exposed as stable landing pages instead of query-string filters so search engines can crawl them more reliably.`}
        </p>
        <div className="mt-6">
          <Button asChild variant="outline">
            <Link href={`/${locale}/blogs`}>{locale === "ar" ? "عرض كل المقالات" : "View all articles"}</Link>
          </Button>
        </div>
      </header>

      <div className="mb-8 text-center text-sm text-muted-foreground">
        {locale === "ar" ? `${posts.length} مقالات في هذا التصنيف` : `${posts.length} articles in this category`}
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} locale={locale} />
        ))}
      </div>
    </main>
  );
}
