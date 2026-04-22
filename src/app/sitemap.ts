import { MetadataRoute } from 'next'
import { eq } from 'drizzle-orm'
import { db } from '@/src/db'
import { projects, posts, certificates } from '@/src/db/schema'
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

  // Fetch all certificates
  const allCertificates = await db.select({
    id: certificates.id,
    updatedAt: certificates.updatedAt,
  }).from(certificates).where(eq(certificates.published, true))

  // Keep a stable, data-driven lastModified across sitemap entries.
  const knownTimestamps = [
    ...allProjects.map((item) => item.updatedAt?.getTime()),
    ...allPosts.map((item) => item.updatedAt?.getTime()),
    ...allCertificates.map((item) => item.updatedAt?.getTime()),
  ].filter((value): value is number => typeof value === 'number');
  const siteLastModified = knownTimestamps.length
    ? new Date(Math.max(...knownTimestamps))
    : new Date('2025-01-01T00:00:00.000Z');

   // Static pages - Homepage and main sections
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
     // Certificates listing page
     {
       url: `${baseUrl}/en/certificates`,
       lastModified: siteLastModified,
       changeFrequency: 'monthly' as const,
       priority: 0.8,
       alternates: {
         languages: {
           en: `${baseUrl}/en/certificates`,
           ar: `${baseUrl}/ar/certificates`,
         },
       },
     },
     {
       url: `${baseUrl}/ar/certificates`,
       lastModified: siteLastModified,
       changeFrequency: 'monthly' as const,
       priority: 0.8,
       alternates: {
         languages: {
           en: `${baseUrl}/en/certificates`,
           ar: `${baseUrl}/ar/certificates`,
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
           },
         },
       }
     );
     return acc;
   }, [])

   // Blog pages (both languages)
   const blogPages: SitemapEntry[] = allPosts.reduce<SitemapEntry[]>((acc, post) => {
     acc.push(
       {
         url: `${baseUrl}/en/blogs/${post.slug}`,
         lastModified: post.updatedAt ?? siteLastModified,
         changeFrequency: 'monthly' as const,
         priority: 0.6,
         alternates: {
           languages: {
             en: `${baseUrl}/en/blogs/${post.slug}`,
             ar: `${baseUrl}/ar/blogs/${post.slug}`,
           },
         },
       },
       {
         url: `${baseUrl}/ar/blogs/${post.slug}`,
         lastModified: post.updatedAt ?? siteLastModified,
         changeFrequency: 'monthly' as const,
         priority: 0.6,
         alternates: {
           languages: {
             en: `${baseUrl}/en/blogs/${post.slug}`,
             ar: `${baseUrl}/ar/blogs/${post.slug}`,
           },
         },
       }
     );
     return acc;
   }, [])

  // Certificate pages (both languages)
  const certificatePages: SitemapEntry[] = allCertificates.reduce<SitemapEntry[]>((acc, cert) => {
    acc.push(
      {
        url: `${baseUrl}/en/certificates/${cert.id}`,
        lastModified: cert.updatedAt ?? siteLastModified,
        changeFrequency: 'yearly' as const,
        priority: 0.5,
        alternates: {
          languages: {
            en: `${baseUrl}/en/certificates/${cert.id}`,
            ar: `${baseUrl}/ar/certificates/${cert.id}`,
            'x-default': `${baseUrl}/en/certificates/${cert.id}`,
          },
        },
      },
      {
        url: `${baseUrl}/ar/certificates/${cert.id}`,
        lastModified: cert.updatedAt ?? siteLastModified,
        changeFrequency: 'yearly' as const,
        priority: 0.5,
        alternates: {
          languages: {
            en: `${baseUrl}/en/certificates/${cert.id}`,
            ar: `${baseUrl}/ar/certificates/${cert.id}`,
            'x-default': `${baseUrl}/en/certificates/${cert.id}`,
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

  return [
    ...staticPages,
    ...projectPages,
    ...blogPages,
    ...certificatePages,
    ...categoryPages,
  ]
}
