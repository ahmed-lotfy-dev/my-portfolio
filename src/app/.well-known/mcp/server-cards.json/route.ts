import { absoluteUrl, siteConfig } from "@/src/lib/agent-ready/site"

export const dynamic = "force-static"

export async function GET() {
  return Response.json(
    {
      cards: [absoluteUrl(siteConfig.mcpServerCardPath)],
    },
    {
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    }
  )
}
