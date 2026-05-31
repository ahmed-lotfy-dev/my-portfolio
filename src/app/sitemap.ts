import { MetadataRoute } from 'next'
import { eq } from 'drizzle-orm'
import { db } from '@/src/db'
import { projects, posts } from '@/src/db/schema'
import { slugifyBlogTaxonomy } from '@/src/lib/utils/blog-taxonomy'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://ahmedlotfy.site'

  // Fetch all projects
  const allProjects = await db.select({
    slug: projects.slug,
    updatedAt: projects.updatedAt,
  }).from(projects).where(eq(projects.published, true))

  // Fetch all blog posts
  const allPosts = await db.select({
    slug: posts.slug,
    updatedAt: posts.updatedAt,
    categories: posts.categories,
  }).from(posts).where(eq(posts.published, true))

  // Stable lastModified across sitemap entries
  const knownTimestamps = [
    ...allProjects.map((item) => item.updatedAt?.getTime()),
    ...allPosts.map((item) => item.updatedAt?.getTime()),
  ].filter((value): value is number => typeof value === 'number')
  const siteLastModified = knownTimestamps.length
    ? new Date(Math.max(...knownTimestamps))
    : new Date()

  type SitemapEntry = MetadataRoute.Sitemap[number];

  // Helper: build alternates for a given locale + path
  function alternatesFor(path: string, locale: string) {
    return {
      en: `${baseUrl}/en${path}`,
      ar: `${baseUrl}/ar${path}`,
      'x-default': `${baseUrl}/en${path}`,
      [locale]: `${baseUrl}/${locale}${path}`,
    }
  }

  // ── Static pages ──
  const staticPaths = [
    { path: '', priority: 1, changeFrequency: 'weekly' as const },
    { path: '/blogs', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/projects', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/about', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/contact', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/certificates', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/privacy', priority: 0.2, changeFrequency: 'yearly' as const },
    { path: '/terms', priority: 0.2, changeFrequency: 'yearly' as const },
  ]

  const staticPages: SitemapEntry[] = staticPaths.flatMap((page) => {
    const entries: SitemapEntry[] = []
    for (const locale of ['en', 'ar']) {
      entries.push({
        url: `${baseUrl}/${locale}${page.path}`,
        lastModified: siteLastModified,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: {
          languages: alternatesFor(page.path, locale),
        },
      })
    }
    return entries
  })

  // ── Project pages ──
  const projectPages: SitemapEntry[] = allProjects.flatMap((project) => {
    const path = `/projects/${project.slug}`
    return (['en', 'ar'] as const).map((locale) => ({
      url: `${baseUrl}/${locale}${path}`,
      lastModified: project.updatedAt ?? siteLastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
      alternates: {
        languages: alternatesFor(path, locale),
      },
    }))
  })

  // ── Blog post pages ──
  const blogPages: SitemapEntry[] = allPosts.flatMap((post) => {
    const path = `/blogs/${post.slug}`
    return (['en', 'ar'] as const).map((locale) => ({
      url: `${baseUrl}/${locale}${path}`,
      lastModified: post.updatedAt ?? siteLastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
      alternates: {
        languages: alternatesFor(path, locale),
      },
    }))
  })

  // ── Blog category pages ──
  const categoryMap = new Map<string, { slug: string; count: number; updatedAt: Date | null }>()
  for (const post of allPosts) {
    for (const category of post.categories || []) {
      const normalized = category.trim()
      if (!normalized) continue
      const slug = slugifyBlogTaxonomy(normalized)
      const existing = categoryMap.get(normalized)
      if (existing) {
        existing.count += 1
        if (post.updatedAt && (!existing.updatedAt || post.updatedAt > existing.updatedAt)) {
          existing.updatedAt = post.updatedAt
        }
      } else {
        categoryMap.set(normalized, { slug, count: 1, updatedAt: post.updatedAt ?? null })
      }
    }
  }

  const categoryPages: SitemapEntry[] = Array.from(categoryMap.entries()).flatMap(([, data]) => {
    if (data.count < 2 || !data.slug) return []
    const path = `/blogs/category/${data.slug}`
    return (['en', 'ar'] as const).map((locale) => ({
      url: `${baseUrl}/${locale}${path}`,
      lastModified: data.updatedAt ?? siteLastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
      alternates: {
        languages: alternatesFor(path, locale),
      },
    }))
  })

  // NOTE: Certificate detail pages are intentionally excluded.
  // They use UUID-based URLs with thin content (~50 words each).
  // Google treats these as low-value; including them drags down site-wide quality signals.

  return [
    ...staticPages,
    ...projectPages,
    ...blogPages,
    ...categoryPages,
  ]
}
