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
  }).from(certificates)
  
  // Static pages - Homepage and main sections
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/en`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/ar`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    // Projects listing page
    {
      url: `${baseUrl}/en/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ar/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    // Blogs listing page
    {
      url: `${baseUrl}/en/blogs`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ar/blogs`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    // Certificates listing page
    {
      url: `${baseUrl}/en/certificates`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ar/certificates`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
  ]
  
  // Project pages (both languages)
  const projectPages = allProjects.flatMap(project => [
    {
      url: `${baseUrl}/en/projects/${project.slug}`,
      lastModified: project.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ar/projects/${project.slug}`,
      lastModified: project.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
  ])
  
  // Blog pages (both languages)
  const blogPages = allPosts.flatMap(post => [
    {
      url: `${baseUrl}/en/blogs/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/ar/blogs/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
  ])
  
  // Certificate pages (both languages)
  const certificatePages = allCertificates.flatMap(cert => [
    {
      url: `${baseUrl}/en/certificates/${cert.id}`,
      lastModified: cert.updatedAt,
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/ar/certificates/${cert.id}`,
      lastModified: cert.updatedAt,
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
  ])
  
  return [
    ...staticPages,
    ...projectPages,
    ...blogPages,
    ...certificatePages,
  ]
}
