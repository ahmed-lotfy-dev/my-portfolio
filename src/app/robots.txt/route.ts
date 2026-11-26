import { absoluteUrl } from "@/src/lib/agent-ready/site"

const robotsBody = `# Robots.txt for Ahmed Lotfy Portfolio
# Optimized for search engines and AI crawlers

User-agent: *
Allow: /
Disallow: /cdn-cgi/
Disallow: /api/
Disallow: /dashboard/
Allow: /ai-sitemap.json

# AI crawlers - full access to content
User-agent: GPTBot
Allow: /
Disallow: /cdn-cgi/
Disallow: /api/
Allow: /ai-sitemap.json

User-agent: ChatGPT-User
Allow: /
Disallow: /cdn-cgi/
Disallow: /api/
Allow: /ai-sitemap.json

User-agent: Claude-Web
Allow: /
Disallow: /cdn-cgi/
Disallow: /api/
Allow: /ai-sitemap.json

User-agent: ClaudeBot
Allow: /
Disallow: /cdn-cgi/
Disallow: /api/
Allow: /ai-sitemap.json

User-agent: PerplexityBot
Allow: /
Disallow: /cdn-cgi/
Disallow: /api/
Allow: /ai-sitemap.json

User-agent: CCBot
Allow: /
Disallow: /cdn-cgi/
Disallow: /api/
Allow: /ai-sitemap.json

User-agent: Muse
Allow: /
Disallow: /cdn-cgi/
Disallow: /api/
Allow: /ai-sitemap.json

User-agent: Instinct
Allow: /
Disallow: /cdn-cgi/
Disallow: /api/
Allow: /ai-sitemap.json

User-agent: Meta-ExternalAgent
Allow: /
Disallow: /cdn-cgi/
Disallow: /api/
Allow: /ai-sitemap.json

User-agent: Amazonbot
Allow: /
Disallow: /cdn-cgi/
Disallow: /api/
Allow: /ai-sitemap.json

# SEO tools - allow access
User-agent: AhrefsBot
Allow: /

User-agent: SemrushBot
Allow: /

# Other search engines
User-agent: Bingbot
Allow: /
Disallow: /cdn-cgi/
Allow: /_next/static/
Allow: /_next/image/

User-agent: Applebot
Allow: /
Disallow: /cdn-cgi/
Allow: /_next/static/
Allow: /_next/image/

User-agent: Twitterbot
Allow: /

User-agent: LinkedInBot
Allow: /

# Sitemaps
Sitemap: ${absoluteUrl("/sitemap.xml")}

# Preferred domain
Host: https://alotfy.site
`

export async function GET() {
  return new Response(robotsBody, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  })
}