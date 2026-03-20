import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/en/login',
        '/ar/login',
        '/en/signup',
        '/ar/signup',
        '/en/dashboard/',
        '/ar/dashboard/',
      ],
    },
    host: 'https://ahmedlotfy.site',
    sitemap: 'https://ahmedlotfy.site/sitemap.xml',
  }
}
