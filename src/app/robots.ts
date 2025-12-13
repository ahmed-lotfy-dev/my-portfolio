import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/api/',
          '/_next/',
          '/login',
          '/signup',
        ],
      },
      {
        userAgent: 'GPTBot', // OpenAI
        allow: '/',
        disallow: ['/dashboard/', '/api/'],
      },
      {
        userAgent: 'ChatGPT-User', // ChatGPT
        allow: '/',
        disallow: ['/dashboard/', '/api/'],
      },
      {
        userAgent: 'Google-Extended', // Google Bard
        allow: '/',
        disallow: ['/dashboard/', '/api/'],
      },
      {
        userAgent: 'anthropic-ai', // Claude
        allow: '/',
        disallow: ['/dashboard/', '/api/'],
      },
      {
        userAgent: 'ClaudeBot', // Claude crawler
        allow: '/',
        disallow: ['/dashboard/', '/api/'],
      },
    ],
    sitemap: 'https://ahmedlotfy.site/sitemap.xml',
  }
}
