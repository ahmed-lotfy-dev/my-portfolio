import { absoluteUrl } from "@/src/lib/agent-ready/site"

const robotsBody = `# Robots.txt for Ahmed Lotfy Portfolio
# Optimized for search engines and AI crawlers

User-agent: *
Allow: /
Disallow: /cdn-cgi/
Disallow: /api/
Disallow: /dashboard/
Allow: /ai-sitemap.json

# Googlebot gets full access (just block junk)
User-agent: Googlebot
Allow: /
Disallow: /cdn-cgi/
Disallow: /api/
Disallow: /dashboard/
Allow: /_next/static/
Allow: /_next/image/
Crawl-delay: 1

# AI crawlers - allow content, block static junk
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

User-agent: CCBot
Allow: /
Disallow: /cdn-cgi/
Disallow: /api/
Allow: /ai-sitemap.json

# Other search engines
User-agent: Bingbot
Allow: /
Disallow: /cdn-cgi/
Allow: /_next/static/
Allow: /_next/image/
Crawl-delay: 1

User-agent: Applebot
Allow: /
Disallow: /cdn-cgi/
Allow: /_next/static/
Allow: /_next/image/

User-agent: Twitterbot
Allow: /

User-agent: LinkedInBot
Allow: /

# Block known bad crawlers (scrapers, SEO spam tools)
User-agent: AhrefsBot
Disallow: /

User-agent: SemrushBot
Disallow: /

User-agent: MJ12bot
Disallow: /

User-agent: DotBot
Disallow: /

User-agent: Bytespider
Disallow: /

# Sitemaps
Sitemap: ${absoluteUrl("/sitemap.xml")}
Sitemap: ${absoluteUrl("/ai-sitemap.json")}

# AI content preferences
Content-Signal: ai-train=no, search=yes, ai-input=yes

# Crawl delay for respectful crawlers
Crawl-delay: 1

# Clean parameters
Clean-param: utm_*&ref_

# Preferred domain
Host: https://ahmedlotfy.site
`

export async function GET() {
  return new Response(robotsBody, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  })
}
