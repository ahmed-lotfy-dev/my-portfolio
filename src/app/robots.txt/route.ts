import { absoluteUrl } from "@/src/lib/agent-ready/site"

const robotsBody = `# Robots.txt for Ahmed Lotfy Portfolio
# Optimized for search engines and AI crawlers

User-agent: *
Allow: /
Disallow: /_next/static/
Disallow: /cdn-cgi/
Disallow: /api/
Disallow: /dashboard/

# Block static assets to preserve crawl budget
Disallow: /*.woff2$
Disallow: /*.json$

# Googlebot gets full access (just block junk)
User-agent: Googlebot
Allow: /
Disallow: /_next/static/
Disallow: /cdn-cgi/
Disallow: /api/
Disallow: /dashboard/
Crawl-delay: 1

# AI crawlers - allow content, block static junk
User-agent: GPTBot
Allow: /
Disallow: /_next/static/
Disallow: /cdn-cgi/
Disallow: /api/

User-agent: ChatGPT-User
Allow: /
Disallow: /_next/static/
Disallow: /cdn-cgi/
Disallow: /api/

User-agent: Claude-Web
Allow: /
Disallow: /_next/static/
Disallow: /cdn-cgi/
Disallow: /api/

User-agent: CCBot
Allow: /
Disallow: /_next/static/
Disallow: /cdn-cgi/
Disallow: /api/

# Other search engines
User-agent: Bingbot
Allow: /
Disallow: /_next/static/
Disallow: /cdn-cgi/
Crawl-delay: 1

User-agent: Applebot
Allow: /
Disallow: /_next/static/
Disallow: /cdn-cgi/

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
