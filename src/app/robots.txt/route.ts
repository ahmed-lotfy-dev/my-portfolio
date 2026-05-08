import { absoluteUrl } from "@/src/lib/agent-ready/site"

const robotsBody = `# Robots.txt for Ahmed Shoman Portfolio
# Optimized for AI agents, search engines, and web crawlers

User-agent: *
Allow: /

# AI Agents & Search Engine Crawlers
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: Bingbot
Allow: /
Crawl-delay: 1

User-agent: Applebot
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: LinkedInBot
Allow: /

User-agent: FacebookBot
Allow: /

# Block bad crawlers
User-agent: AhrefsBot
Disallow: /

User-agent: SemrushBot
Disallow: /

User-agent: MJ12bot
Disallow: /

# Sitemaps
Sitemap: ${absoluteUrl("/sitemap.xml")}
Sitemap: ${absoluteUrl("/ai-sitemap.json")}

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