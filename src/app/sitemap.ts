import { MetadataRoute } from 'next'
import { eq } from 'drizzle-orm'
import { db } from '@/src/db'
import { projects, posts, certificates } from '@/src/db/schema'

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
      url: baseUrl,
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

  // Project pages (both languages)
  const projectPages = allProjects.flatMap(project => [
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
    },
  ])

  // Blog pages (both languages)
  const blogPages = allPosts.flatMap(post => [
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
    },
  ])

  // Certificate pages (both languages)
  const certificatePages = allCertificates.flatMap(cert => [
    {
      url: `${baseUrl}/en/certificates/${cert.id}`,
      lastModified: cert.updatedAt ?? siteLastModified,
      changeFrequency: 'yearly' as const,
      priority: 0.5,
      alternates: {
        languages: {
          en: `${baseUrl}/en/certificates/${cert.id}`,
          ar: `${baseUrl}/ar/certificates/${cert.id}`,
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
        },
      },
    },
  ])

  return [
    ...staticPages,
    ...projectPages,
    ...blogPages,
    ...certificatePages,
  ]
}
