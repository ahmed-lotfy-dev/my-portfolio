import { MetadataRoute } from 'next'
import { eq } from 'drizzle-orm'
import { db } from '@/src/db'
import { projects, posts, certificates } from '@/src/db/schema'

export const dynamic = 'force-dynamic'

// AI Agent-friendly Sitemap - Enhanced for AI crawlers and search engines
export default async function aiSitemap(): Promise<Response> {
  const baseUrl = 'https://ahmedlotfy.site'

  // Fetch all content from database
  const allProjects = await db.select({
    slug: projects.slug,
    title: projects.title,
    description: projects.description,
    updatedAt: projects.updatedAt,
    tags: projects.tags,
  }).from(projects).where(eq(projects.published, true))

  const allPosts = await db.select({
    slug: posts.slug,
    title: posts.title,
    description: posts.description,
    updatedAt: posts.updatedAt,
    categories: posts.categories,
  }).from(posts).where(eq(posts.published, true))

  const allCertificates = await db.select({
    id: certificates.id,
    title: certificates.title,
    description: certificates.description,
    issuedAt: certificates.issuedAt,
    issuer: certificates.issuer,
  }).from(certificates).where(eq(certificates.published, true))

  // Build AI-friendly structured sitemap
  const aiSitemap = {
    schema: 'https://ai-sitemap-schema.dev/v1',
    generatedAt: new Date().toISOString(),
    site: {
      name: 'Ahmed Shoman Portfolio',
      nameArabic: 'معرض أعمال أحمد شومان',
      description: 'Full Stack Developer specializing in Next.js, React, TypeScript, Node.js, and modern web technologies',
      descriptionArabic: 'مطور ويب متخصص في Next.js و React و TypeScript و Node.js والتقنيات الحديثة',
      url: baseUrl,
      author: {
        name: 'Ahmed Shoman',
        nameArabic: 'أحمد شومان',
        title: 'Full Stack Developer',
        titleArabic: 'مطور ويب كامل',
        email: 'ahmed@ahmedlotfy.site',
        github: 'https://github.com/ahmed-lotfy-dev',
        linkedin: 'https://linkedin.com/in/ahmed-lotfy-dev',
        twitter: 'https://twitter.com/ahmedlotfy_dev',
      },
      languages: ['en', 'ar'],
      locale: 'en_US',
      localeArabic: 'ar_EG',
    },
    services: [
      {
        name: 'Web Development',
        nameArabic: 'تطوير الويب',
        description: 'Building modern, responsive web applications using Next.js, React, and TypeScript',
        descriptionArabic: 'بناء تطبيقات ويب حديثة ومتجاوبة باستخدام Next.js و React و TypeScript',
        skills: ['Next.js', 'React', 'TypeScript', 'Node.js', 'PostgreSQL', 'TailwindCSS', 'Node.js', 'Python'],
      },
      {
        name: 'Full Stack Development',
        nameArabic: 'تطوير الويب الكامل',
        description: 'End-to-end web application development from frontend to backend',
        descriptionArabic: 'تطوير تطبيقات ويب من البداية إلى النهاية من الواجهة الأمامية إلى الخلفية',
        skills: ['Next.js', 'React', 'TypeScript', 'Node.js', 'PostgreSQL', 'MongoDB', 'REST APIs', 'GraphQL'],
      },
      {
        name: 'API Development',
        nameArabic: 'تطوير واجهات برمجة التطبيقات',
        description: 'Building robust REST and GraphQL APIs',
        descriptionArabic: 'بناء واجهات برمجة تطبيقات قوية REST و GraphQL',
        skills: ['REST API', 'GraphQL', 'Node.js', 'Express', 'PostgreSQL'],
      },
      {
        name: 'Database Design',
        nameArabic: 'تصميم قواعد البيانات',
        description: 'Designing and optimizing database structures',
        descriptionArabic: 'تصميم وتحسين هياكل قواعد البيانات',
        skills: ['PostgreSQL', 'MongoDB', 'Database Design', 'Performance Optimization'],
      },
    ],
    pages: {
      home: {
        url: `${baseUrl}/en`,
        urlArabic: `${baseUrl}/ar`,
        title: 'Ahmed Shoman - Full Stack Developer',
        titleArabic: 'أحمد شومان - مطور ويب كامل',
        description: 'Portfolio of Ahmed Shoman, a Full Stack Developer specializing in Next.js, React, TypeScript, Node.js, PostgreSQL, and modern web technologies',
        descriptionArabic: 'معرض أعمال أحمد شومان، مطور ويب كامل متخصص في Next.js و React و TypeScript و Node.js و PostgreSQL والتقنيات الحديثة',
        lastModified: new Date().toISOString(),
      },
      blogs: {
        url: `${baseUrl}/en/blogs`,
        urlArabic: `${baseUrl}/ar/blogs`,
        title: 'Blog - Ahmed Shoman',
        titleArabic: 'المدونة - أحمد شومان',
        description: 'Technical blog posts about web development, programming, and technology',
        descriptionArabic: 'مقالات تقنية عن تطوير الويب والبرمجة والتكنولوجيا',
        postCount: allPosts.length,
      },
      projects: {
        url: `${baseUrl}/en/projects`,
        urlArabic: `${baseUrl}/ar/projects`,
        title: 'Projects - Ahmed Shoman',
        titleArabic: 'المشاريع - أحمد شومان',
        description: 'Portfolio of web development projects and applications',
        descriptionArabic: 'معرض مشاريع تطوير الويب والتطبيقات',
        projectCount: allProjects.length,
      },
      certificates: {
        url: `${baseUrl}/en/certificates`,
        urlArabic: `${baseUrl}/ar/certificates`,
        title: 'Certificates - Ahmed Shoman',
        titleArabic: 'الشهادات - أحمد شومان',
        description: 'Professional certificates and achievements',
        descriptionArabic: 'الشهادات والإنجازات المهنية',
        certificateCount: allCertificates.length,
      },
    },
    projects: allProjects.map(project => ({
      slug: project.slug,
      url: `${baseUrl}/en/projects/${project.slug}`,
      urlArabic: `${baseUrl}/ar/projects/${project.slug}`,
      title: project.title,
      titleArabic: project.title, // Would need translation lookup
      description: project.description,
      descriptionArabic: project.description, // Would need translation lookup
      tags: project.tags || [],
      lastModified: project.updatedAt?.toISOString(),
    })),
    blogPosts: allPosts.map(post => ({
      slug: post.slug,
      url: `${baseUrl}/en/blogs/${post.slug}`,
      urlArabic: `${baseUrl}/ar/blogs/${post.slug}`,
      title: post.title,
      titleArabic: post.title, // Would need translation lookup
      description: post.description,
      descriptionArabic: post.description, // Would need translation lookup
      categories: post.categories || [],
      lastModified: post.updatedAt?.toISOString(),
    })),
    certificates: allCertificates.map(cert => ({
      id: cert.id,
      url: `${baseUrl}/en/certificates/${cert.id}`,
      urlArabic: `${baseUrl}/ar/certificates/${cert.id}`,
      title: cert.title,
      titleArabic: cert.title, // Would need translation lookup
      description: cert.description,
      descriptionArabic: cert.description, // Would need translation lookup
      issuer: cert.issuer,
      issuedAt: cert.issuedAt?.toISOString(),
    })),
    skills: [
      // Frontend
      'Next.js', 'React', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'TailwindCSS', 'Radix UI', 'Framer Motion',
      // Backend
      'Node.js', 'Python', 'Express', 'PostgreSQL', 'MongoDB', 'Drizzle ORM', 'Prisma',
      // Tools & DevOps
      'Git', 'Docker', 'AWS', 'Vercel', 'CI/CD', 'Testing', 'Vitest', 'Playwright',
      // Other
      'REST API', 'GraphQL', 'Authentication', 'Payment Integration', 'Performance Optimization', 'SEO',
    ],
    contact: {
      email: 'ahmed@ahmedlotfy.site',
      github: 'https://github.com/ahmed-lotfy-dev',
      linkedin: 'https://linkedin.com/in/ahmed-lotfy-dev',
      twitter: 'https://twitter.com/ahmedlotfy_dev',
      website: baseUrl,
    },
  }

  return new Response(JSON.stringify(aiSitemap, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      'X-AI-Agent-Friendly': 'true',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}