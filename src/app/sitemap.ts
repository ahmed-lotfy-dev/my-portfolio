import { MetadataRoute } from 'next'
import projectsData from '@/src/data/projects.json'
import { slugifyBlogTaxonomy } from '@/src/lib/utils/blog-taxonomy'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://ahmedlotfy.site'

  type SitemapEntry = MetadataRoute.Sitemap[number];

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
          languages: alternatesFor(page.path, locale),
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
        languages: alternatesFor(path, locale),
      },
    }))
  })

  return [...staticPages, ...projectPages]
}
