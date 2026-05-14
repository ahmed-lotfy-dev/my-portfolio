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

  // Keep a stable, data-driven lastModified across sitemap entries.
  const knownTimestamps = [
    ...allProjects.map((item) => item.updatedAt?.getTime()),
    ...allPosts.map((item) => item.updatedAt?.getTime()),
  ].filter((value): value is number => typeof value === 'number');
  const siteLastModified = knownTimestamps.length
    ? new Date(Math.max(...knownTimestamps))
    : new Date('2025-01-01T00:00:00.000Z');

   // Static pages - core content only
   const staticPages = [
     {
       url: `${baseUrl}/en`,
       lastModified: siteLastModified,
       changeFrequency: 'weekly' as const,
       priority: 1,
        alternates: {
          languages: {
            en: `${baseUrl}/en`,
            ar: `${baseUrl}/ar`,
            'x-default': `${baseUrl}/en`,
          },
        },
      },
      {
        url: `${baseUrl}/ar`,
        lastModified: siteLastModified,
        changeFrequency: 'weekly' as const,
        priority: 1,
        alternates: {
          languages: {
            en: `${baseUrl}/en`,
            ar: `${baseUrl}/ar`,
            'x-default': `${baseUrl}/en`,
          },
        },
      },
      // Blogs listing page
      {
        url: `${baseUrl}/en/blogs`,
        lastModified: siteLastModified,
        changeFrequency: 'weekly' as const,
        priority: 0.9,
        alternates: {
          languages: {
            en: `${baseUrl}/en/blogs`,
            ar: `${baseUrl}/ar/blogs`,
            'x-default': `${baseUrl}/en/blogs`,
          },
        },
      },
      {
        url: `${baseUrl}/ar/blogs`,
        lastModified: siteLastModified,
        changeFrequency: 'weekly' as const,
        priority: 0.9,
        alternates: {
          languages: {
            en: `${baseUrl}/en/blogs`,
            ar: `${baseUrl}/ar/blogs`,
            'x-default': `${baseUrl}/en/blogs`,
          },
        },
      },
     // Projects listing page
     {
       url: `${baseUrl}/en/projects`,
       lastModified: siteLastModified,
       changeFrequency: 'weekly' as const,
       priority: 0.9,
       alternates: {
         languages: {
           en: `${baseUrl}/en/projects`,
           ar: `${baseUrl}/ar/projects`,
           'x-default': `${baseUrl}/en/projects`,
         },
       },
     },
     {
       url: `${baseUrl}/ar/projects`,
       lastModified: siteLastModified,
       changeFrequency: 'weekly' as const,
       priority: 0.9,
       alternates: {
         languages: {
           en: `${baseUrl}/en/projects`,
           ar: `${baseUrl}/ar/projects`,
           'x-default': `${baseUrl}/en/projects`,
         },
       },
     },
     // About page
    {
      url: `${baseUrl}/en/about`,
      lastModified: siteLastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
      alternates: {
         languages: {
           en: `${baseUrl}/en/about`,
           ar: `${baseUrl}/ar/about`,
           'x-default': `${baseUrl}/en/about`,
         },
       },
     },
     {
       url: `${baseUrl}/ar/about`,
       lastModified: siteLastModified,
       changeFrequency: 'monthly' as const,
       priority: 0.8,
       alternates: {
         languages: {
           en: `${baseUrl}/en/about`,
           ar: `${baseUrl}/ar/about`,
           'x-default': `${baseUrl}/en/about`,
         },
       },
     },
     // Contact page
    {
      url: `${baseUrl}/en/contact`,
      lastModified: siteLastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
      alternates: {
          languages: {
            en: `${baseUrl}/en/contact`,
            ar: `${baseUrl}/ar/contact`,
            'x-default': `${baseUrl}/en/contact`,
          },
        },
      },
      {
        url: `${baseUrl}/ar/contact`,
        lastModified: siteLastModified,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
        alternates: {
          languages: {
            en: `${baseUrl}/en/contact`,
            ar: `${baseUrl}/ar/contact`,
            'x-default': `${baseUrl}/en/contact`,
          },
        },
      },
      // Certificates listing page
     {
       url: `${baseUrl}/en/certificates`,
       lastModified: siteLastModified,
       changeFrequency: 'monthly' as const,
       priority: 0.5,
       alternates: {
          languages: {
            en: `${baseUrl}/en/certificates`,
            ar: `${baseUrl}/ar/certificates`,
            'x-default': `${baseUrl}/en/certificates`,
          },
        },
      },
      {
        url: `${baseUrl}/ar/certificates`,
        lastModified: siteLastModified,
        changeFrequency: 'monthly' as const,
        priority: 0.5,
        alternates: {
          languages: {
            en: `${baseUrl}/en/certificates`,
            ar: `${baseUrl}/ar/certificates`,
            'x-default': `${baseUrl}/en/certificates`,
          },
        },
      },
      {
        url: `${baseUrl}/en/privacy`,
        lastModified: siteLastModified,
        changeFrequency: 'yearly' as const,
        priority: 0.2,
        alternates: {
          languages: {
            en: `${baseUrl}/en/privacy`,
            ar: `${baseUrl}/ar/privacy`,
            'x-default': `${baseUrl}/en/privacy`,
          },
        },
      },
      {
        url: `${baseUrl}/ar/privacy`,
        lastModified: siteLastModified,
        changeFrequency: 'yearly' as const,
        priority: 0.2,
        alternates: {
          languages: {
            en: `${baseUrl}/en/privacy`,
            ar: `${baseUrl}/ar/privacy`,
            'x-default': `${baseUrl}/en/privacy`,
          },
        },
      },
      {
        url: `${baseUrl}/en/terms`,
        lastModified: siteLastModified,
        changeFrequency: 'yearly' as const,
        priority: 0.2,
        alternates: {
          languages: {
            en: `${baseUrl}/en/terms`,
            ar: `${baseUrl}/ar/terms`,
            'x-default': `${baseUrl}/en/terms`,
          },
        },
      },
      {
        url: `${baseUrl}/ar/terms`,
        lastModified: siteLastModified,
        changeFrequency: 'yearly' as const,
        priority: 0.2,
        alternates: {
          languages: {
            en: `${baseUrl}/en/terms`,
            ar: `${baseUrl}/ar/terms`,
            'x-default': `${baseUrl}/en/terms`,
          },
        },
      },
   ]

  type SitemapEntry = MetadataRoute.Sitemap[number];

   // Project pages (both languages)
   const projectPages: SitemapEntry[] = allProjects.reduce<SitemapEntry[]>((acc, project) => {
     acc.push(
       {
         url: `${baseUrl}/en/projects/${project.slug}`,
         lastModified: project.updatedAt ?? siteLastModified,
         changeFrequency: 'monthly' as const,
         priority: 0.8,
          alternates: {
            languages: {
              en: `${baseUrl}/en/projects/${project.slug}`,
              ar: `${baseUrl}/ar/projects/${project.slug}`,
              'x-default': `${baseUrl}/en/projects/${project.slug}`,
            },
          },
        },
        {
          url: `${baseUrl}/ar/projects/${project.slug}`,
          lastModified: project.updatedAt ?? siteLastModified,
          changeFrequency: 'monthly' as const,
          priority: 0.8,
          alternates: {
            languages: {
              en: `${baseUrl}/en/projects/${project.slug}`,
              ar: `${baseUrl}/ar/projects/${project.slug}`,
              'x-default': `${baseUrl}/en/projects/${project.slug}`,
            },
          },
        }
      );
      return acc;
    }, [])

    // Blog pages (both languages) — these are the site's richest content
   const blogPages: SitemapEntry[] = allPosts.reduce<SitemapEntry[]>((acc, post) => {
     acc.push(
       {
         url: `${baseUrl}/en/blogs/${post.slug}`,
         lastModified: post.updatedAt ?? siteLastModified,
         changeFrequency: 'monthly' as const,
         priority: 0.8,
          alternates: {
            languages: {
              en: `${baseUrl}/en/blogs/${post.slug}`,
              ar: `${baseUrl}/ar/blogs/${post.slug}`,
              'x-default': `${baseUrl}/en/blogs/${post.slug}`,
            },
          },
        },
        {
          url: `${baseUrl}/ar/blogs/${post.slug}`,
          lastModified: post.updatedAt ?? siteLastModified,
          changeFrequency: 'monthly' as const,
          priority: 0.8,
          alternates: {
            languages: {
              en: `${baseUrl}/en/blogs/${post.slug}`,
              ar: `${baseUrl}/ar/blogs/${post.slug}`,
              'x-default': `${baseUrl}/en/blogs/${post.slug}`,
            },
          },
        }
      );
      return acc;
    }, [])

  const categoryEntries = Array.from(
    allPosts.reduce(
      (acc, post) => {
        for (const category of post.categories || []) {
          const normalized = category.trim()
          if (!normalized) continue

          const existing = acc.get(normalized)
          if (existing) {
            existing.count += 1
            if (post.updatedAt && (!existing.updatedAt || post.updatedAt > existing.updatedAt)) {
              existing.updatedAt = post.updatedAt
            }
            continue
          }

          acc.set(normalized, {
            slug: slugifyBlogTaxonomy(normalized),
            count: 1,
            updatedAt: post.updatedAt ?? siteLastModified,
          })
        }
        return acc
      },
      new Map<string, { slug: string; count: number; updatedAt: Date | null }>()
    )
  )

  const categoryPages: SitemapEntry[] = categoryEntries.flatMap(([, data]) => {
    if (data.count < 2 || !data.slug) return []

    const shared = {
      lastModified: data.updatedAt ?? siteLastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
      alternates: {
        languages: {
          en: `${baseUrl}/en/blogs/category/${data.slug}`,
          ar: `${baseUrl}/ar/blogs/category/${data.slug}`,
          'x-default': `${baseUrl}/en/blogs/category/${data.slug}`,
        },
      },
    }

    return [
      {
        url: `${baseUrl}/en/blogs/category/${data.slug}`,
        ...shared,
      },
      {
        url: `${baseUrl}/ar/blogs/category/${data.slug}`,
        ...shared,
      },
    ]
  })

  // ── Certificate detail pages REMOVED from sitemap ──
  // Certificate detail pages use UUID-based URLs and contain thin content
  // (name + date + ~50 words). Google treats these as low-value pages and
  // including them in the sitemap drags down site-wide quality signals.
  // The certificates listing page (above) provides sufficient crawl access.
  const certificatePages: SitemapEntry[] = []

  return [
    ...staticPages,
    ...projectPages,
    ...blogPages,
    ...categoryPages,
    ...certificatePages,
  ]
}
