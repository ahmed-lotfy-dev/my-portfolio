import { MetadataRoute } from 'next'
import projectsData from '@/src/data/projects.json'
import { getAllBlogPosts } from '@/src/lib/blog'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://ahmedlotfy.site'

  type SitemapEntry = MetadataRoute.Sitemap[number];

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

  const staticPages: SitemapEntry[] = staticPaths.flatMap((page) => {
    const entries: SitemapEntry[] = []
    for (const locale of ['en', 'ar']) {
      entries.push({
        url: `${baseUrl}/${locale}${page.path}`,
        lastModified: new Date(),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: {
          languages: {
            en: `${baseUrl}/en${page.path}`,
            ar: `${baseUrl}/ar${page.path}`,
            'x-default': `${baseUrl}/en${page.path}`,
          },
        },
      })
    }
    return entries
  })

  // ── Project pages ──
  const projectPages: SitemapEntry[] = projectsData.flatMap((project) => {
    if (!project.slug || project.published === false) return []
    const path = `/projects/${project.slug}`
    return (['en', 'ar'] as const).map((locale) => ({
      url: `${baseUrl}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
      alternates: {
        languages: {
          en: `${baseUrl}/en${path}`,
          ar: `${baseUrl}/ar${path}`,
          'x-default': `${baseUrl}/en${path}`,
        },
      },
    }))
  })

  // ── Blog posts ──
  // One entry per unique slug, with hreflang pointing to both locale variants
  const enPosts = getAllBlogPosts('en')
  const arPosts = getAllBlogPosts('ar')
  const arSlugSet = new Set(arPosts.map((p) => p.slug))

  const blogPages: SitemapEntry[] = enPosts
    .filter((post) => arSlugSet.has(post.slug))
    .map((post) => {
      const path = `/blogs/${post.slug}`
      return {
        url: `${baseUrl}/en${path}`,
        lastModified: new Date(post.date),
        changeFrequency: 'weekly' as const,
        priority: 0.85,
        alternates: {
          languages: {
            en: `${baseUrl}/en${path}`,
            ar: `${baseUrl}/ar${path}`,
            'x-default': `${baseUrl}/en${path}`,
          },
        },
      }
    })

  return [...staticPages, ...projectPages, ...blogPages]
}
