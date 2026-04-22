import { absoluteUrl, siteConfig } from "@/src/lib/agent-ready/site"

const robotsBody = `User-Agent: *
Allow: /
Disallow: /api/
Disallow: /en/login
Disallow: /ar/login
Disallow: /en/signup
Disallow: /ar/signup
Disallow: /en/dashboard/
Disallow: /ar/dashboard/
Content-Signal: ai-train=no, search=yes, ai-input=yes

Host: ${siteConfig.baseUrl}
Sitemap: ${absoluteUrl("/sitemap.xml")}
`

export async function GET() {
  return new Response(robotsBody, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  })
}
