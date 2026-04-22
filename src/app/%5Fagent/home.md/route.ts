import { getHomepageMarkdown } from "@/src/lib/agent-ready/homepage-markdown"
import { siteConfig } from "@/src/lib/agent-ready/site"

export const dynamic = "force-static"

export async function GET(request: Request) {
  const requestedLocale = new URL(request.url).searchParams.get("locale")
  const locale =
    requestedLocale === "ar" || requestedLocale === "en"
      ? requestedLocale
      : siteConfig.defaultLocale

  const markdown = getHomepageMarkdown(locale)
  const tokenEstimate = markdown.trim().split(/\s+/).filter(Boolean).length

  return new Response(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
      "X-Markdown-Tokens": String(tokenEstimate),
      Vary: "Accept",
    },
  })
}
