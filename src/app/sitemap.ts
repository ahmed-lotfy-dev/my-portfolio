import { MetadataRoute } from 'next'
import projectsData from '@/src/data/projects.json'
import { getAllBlogPosts } from '@/src/lib/blog'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://ahmedlotfy.site'
  const locales = ['en', 'ar'] as const
  type SitemapEntry = MetadataRoute.Sitemap[number];

  // Helper to deduplicate by URL
  function dedupe(entries: SitemapEntry[]): SitemapEntry[] {
    const seen = new Set<string>()
    return entries.filter((e) => {
      if (seen.has(e.url)) return false
      seen.add(e.url)
      return true
    })
  }

  // ── Static pages ──
  const staticPaths = [
    { path: '', priority: 1, changeFrequency: 'weekly' as const },
    { path: '/projects', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/blogs', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/about', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/contact', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/certificates', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/privacy', priority: 0.2, changeFrequency: 'yearly' as const },
    { path: '/terms', priority: 0.2, changeFrequency: 'yearly' as const },
  ]

  const staticPages: SitemapEntry[] = staticPaths.flatMap((page) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}${page.path}`,
      lastModified: new Date(),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    }))
  )

  // ── Project pages ──
  const projectPages: SitemapEntry[] = projectsData.flatMap((project) => {
    if (!project.slug || project.published === false) return []
    const path = `/projects/${project.slug}`
    return locales.map((locale) => ({
      url: `${baseUrl}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))
  })

  // ── Blog posts ──
  const enPosts = getAllBlogPosts('en')
  const arPosts = getAllBlogPosts('ar')
  const arSlugSet = new Set(arPosts.map((p) => p.slug))

  const blogPages: SitemapEntry[] = enPosts
    .filter((post) => arSlugSet.has(post.slug))
    .flatMap((post) =>
      locales.map((locale) => ({
        url: `${baseUrl}/${locale}/blogs/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: 'weekly' as const,
        priority: 0.85,
      }))
    )

  return dedupe([...staticPages, ...projectPages, ...blogPages])
}
