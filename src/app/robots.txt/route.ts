import { absoluteUrl, siteConfig } from "@/src/lib/agent-ready/site"

const robotsBody = `User-agent: *
Allow: /

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
