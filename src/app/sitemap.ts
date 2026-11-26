import { MetadataRoute } from 'next'
import projectsData from '@/src/data/projects.json'
import { getAllBlogPosts, blogPostExistsInLocale } from '@/src/lib/blog'
import fs from 'fs'
import path from 'path'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://alotfy.site'
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

  // Cached file mtime to avoid repeated fs.statSync calls
  const fileMTimeCache = new Map<string, Date>();

  // Get file modification time for static pages (cached)
  function getFileMTime(filePath: string): Date {
    const cached = fileMTimeCache.get(filePath);
    if (cached) return cached;
    try {
      const stats = fs.statSync(filePath)
      const mtime = stats.mtime
      fileMTimeCache.set(filePath, mtime)
      return mtime
    } catch {
      return new Date()
    }
  }

  // Get project last modified from file system if available (cached)
  const projectMTimeCache = new Map<string, Date>();

  function getProjectLastModified(slug: string): Date {
    const cached = projectMTimeCache.get(slug);
    if (cached) return cached;
    const projectDir = path.join(process.cwd(), 'src', 'data', 'projects.json')
    try {
      const stats = fs.statSync(projectDir)
      const mtime = stats.mtime
      projectMTimeCache.set(slug, mtime)
      return mtime
    } catch {
      return new Date()
    }
  }

  // Static pages
  const staticPaths = [
    { path: '', priority: 1, changeFrequency: 'weekly' as const, filePath: 'src/app/[locale]/page.tsx' },
    { path: '/projects', priority: 0.9, changeFrequency: 'weekly' as const, filePath: 'src/app/[locale]/projects/page.tsx' },
    { path: '/blogs', priority: 0.9, changeFrequency: 'weekly' as const, filePath: 'src/app/[locale]/blogs/page.tsx' },
    { path: '/about', priority: 0.8, changeFrequency: 'monthly' as const, filePath: 'src/app/[locale]/about/page.tsx' },
    { path: '/contact', priority: 0.7, changeFrequency: 'monthly' as const, filePath: 'src/app/[locale]/contact/page.tsx' },
    { path: '/certificates', priority: 0.6, changeFrequency: 'monthly' as const, filePath: 'src/app/[locale]/certificates/page.tsx' },
    { path: '/privacy', priority: 0.2, changeFrequency: 'yearly' as const, filePath: 'src/app/[locale]/privacy/page.tsx' },
    { path: '/terms', priority: 0.2, changeFrequency: 'yearly' as const, filePath: 'src/app/[locale]/terms/page.tsx' },
  ]

  const staticPages: SitemapEntry[] = staticPaths.flatMap((page) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}${page.path}`,
      lastModified: getFileMTime(page.filePath),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${baseUrl}/${l}${page.path}`])
        ),
      },
    }))
  )

  // Project pages
  const projectPages: SitemapEntry[] = projectsData.flatMap((project) => {
    if (!project.slug || project.published === false) return []
    const path = `/projects/${project.slug}`
    return locales.map((locale) => ({
      url: `${baseUrl}/${locale}${path}`,
      lastModified: getProjectLastModified(project.slug),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${baseUrl}/${l}${path}`])
        ),
      },
    }))
  })

  // Blog posts - include all published posts in each locale
  const enPosts = getAllBlogPosts('en')
  const arPosts = getAllBlogPosts('ar')

  const blogPages: SitemapEntry[] = [
    ...enPosts.flatMap((post) => {
      const existsInAr = blogPostExistsInLocale(post.slug, 'ar')
      return locales
        .filter((locale) => (locale === 'en') || (locale === 'ar' && existsInAr))
        .map((locale) => ({
          url: `${baseUrl}/${locale}/blogs/${post.slug}`,
          lastModified: new Date(post.date),
          changeFrequency: 'weekly' as const,
          priority: 0.85,
          alternates: {
            languages: {
              en: `${baseUrl}/en/blogs/${post.slug}`,
              ...(existsInAr ? { ar: `${baseUrl}/ar/blogs/${post.slug}` } : {}),
              "x-default": `${baseUrl}/en/blogs/${post.slug}`,
            },
          },
        }))
    }),
    // Add AR-only posts (if any exist)
    ...arPosts
      .filter((post) => !blogPostExistsInLocale(post.slug, 'en'))
      .flatMap((post) => ({
        url: `${baseUrl}/ar/blogs/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: 'weekly' as const,
        priority: 0.85,
        alternates: {
          languages: {
            ar: `${baseUrl}/ar/blogs/${post.slug}`,
            "x-default": `${baseUrl}/en/blogs/${post.slug}`,
          },
        },
      }))
  ]

  return dedupe([...staticPages, ...projectPages, ...blogPages])
}