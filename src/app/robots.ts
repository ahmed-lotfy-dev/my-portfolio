import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const localeAuthPaths = [
    '/en/login',
    '/ar/login',
    '/en/signup',
    '/ar/signup',
  ];

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/_next/',
          ...localeAuthPaths,
        ],
      },
      {
        userAgent: 'GPTBot', // OpenAI
        allow: '/',
        disallow: ['/api/'],
      },
      {
        userAgent: 'ChatGPT-User', // ChatGPT
        allow: '/',
        disallow: ['/api/'],
      },
      {
        userAgent: 'Google-Extended', // Google Bard
        allow: '/',
        disallow: ['/api/'],
      },
      {
        userAgent: 'anthropic-ai', // Claude
        allow: '/',
        disallow: ['/api/'],
      },
      {
        userAgent: 'ClaudeBot', // Claude crawler
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: 'https://ahmedlotfy.site/sitemap.xml',
  }
}
