import { eq } from 'drizzle-orm'
import { db } from '@/src/db'
import { projects, posts, certificates } from '@/src/db/schema'

export const dynamic = 'force-dynamic'

// AI Agent-friendly Sitemap - Enhanced for AI crawlers and search engines
export async function GET(): Promise<Response> {
  const baseUrl = 'https://ahmedlotfy.site'

  // Fetch all content from database
  const allProjects = await db.select({
    slug: projects.slug,
    title_en: projects.title_en,
    title_ar: projects.title_ar,
    desc_en: projects.desc_en,
    desc_ar: projects.desc_ar,
    updatedAt: projects.updatedAt,
    categories: projects.categories,
  }).from(projects).where(eq(projects.published, true))

  const allPosts = await db.select({
    slug: posts.slug,
    title_en: posts.title_en,
    title_ar: posts.title_ar,
    content_en: posts.content_en,
    content_ar: posts.content_ar,
    updatedAt: posts.updatedAt,
    categories: posts.categories,
    tags: posts.tags,
  }).from(posts).where(eq(posts.published, true))

  const allCertificates = await db.select({
    id: certificates.id,
    title: certificates.title,
    desc: certificates.desc,
    imageLink: certificates.imageLink,
    courseLink: certificates.courseLink,
    profLink: certificates.profLink,
    completedAt: certificates.completedAt,
    updatedAt: certificates.updatedAt,
  }).from(certificates).where(eq(certificates.published, true))

  // Build AI-friendly structured sitemap
  const aiSitemap = {
    schema: 'https://ai-sitemap-schema.dev/v1',
    generatedAt: new Date().toISOString(),
    site: {
      name: 'Ahmed Lotfy Portfolio',
      nameArabic: 'معرض أعمال أحمد لطفي',
      description: 'Full Stack Developer portfolio showcasing projects, technical blog posts, and professional certifications',
      descriptionArabic: 'معرض أعمال مطور ويب كامل يعرض المشاريع والمقالات التقنية والشهادات المهنية',
      url: baseUrl,
      author: {
        name: 'Ahmed Lotfy',
        nameArabic: 'أحمد لطفي',
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
        title: 'Ahmed Lotfy - Full Stack Developer',
        titleArabic: 'أحمد لطفي - مطور ويب كامل',
        description: 'Portfolio of Ahmed Lotfy, a Full Stack Developer specializing in Next.js, React, TypeScript, Node.js, PostgreSQL, and modern web technologies',
        descriptionArabic: 'معرض أعمال أحمد لطفي، مطور ويب كامل متخصص في Next.js و React و TypeScript و Node.js و PostgreSQL والتقنيات الحديثة',
        lastModified: new Date().toISOString(),
      },
      blogs: {
        url: `${baseUrl}/en/blogs`,
        urlArabic: `${baseUrl}/ar/blogs`,
        title: 'Blog - Ahmed Lotfy',
        titleArabic: 'المدونة - أحمد لطفي',
        description: 'Technical blog posts about web development, programming, and technology',
        descriptionArabic: 'مقالات تقنية عن تطوير الويب والبرمجة والتكنولوجيا',
        postCount: allPosts.length,
      },
      projects: {
        url: `${baseUrl}/en/projects`,
        urlArabic: `${baseUrl}/ar/projects`,
        title: 'Projects - Ahmed Lotfy',
        titleArabic: 'المشاريع - أحمد لطفي',
        description: 'Portfolio of web development projects and applications',
        descriptionArabic: 'معرض مشاريع تطوير الويب والتطبيقات',
        projectCount: allProjects.length,
      },
      certificates: {
        url: `${baseUrl}/en/certificates`,
        urlArabic: `${baseUrl}/ar/certificates`,
        title: 'Certificates - Ahmed Lotfy',
        titleArabic: 'الشهادات - أحمد لطفي',
        description: 'Professional certificates and achievements',
        descriptionArabic: 'الشهادات والإنجازات المهنية',
        certificateCount: allCertificates.length,
      },
    },
    projects: allProjects.map(project => ({
      slug: project.slug,
      url: `${baseUrl}/en/projects/${project.slug}`,
      urlArabic: `${baseUrl}/ar/projects/${project.slug}`,
      title: project.title_en,
      titleArabic: project.title_ar,
      description: project.desc_en,
      descriptionArabic: project.desc_ar,
      categories: project.categories || [],
      lastModified: project.updatedAt?.toISOString(),
    })),
    blogPosts: allPosts.map(post => ({
      slug: post.slug,
      url: `${baseUrl}/en/blogs/${post.slug}`,
      urlArabic: `${baseUrl}/ar/blogs/${post.slug}`,
      title: post.title_en,
      titleArabic: post.title_ar || post.title_en,
      categories: post.categories || [],
      tags: post.tags || [],
      lastModified: post.updatedAt?.toISOString(),
    })),
    certificates: allCertificates.map(cert => ({
      id: cert.id,
      url: `${baseUrl}/en/certificates/${cert.id}`,
      urlArabic: `${baseUrl}/ar/certificates/${cert.id}`,
      title: cert.title,
      description: cert.desc,
      completedAt: cert.completedAt?.toISOString(),
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
