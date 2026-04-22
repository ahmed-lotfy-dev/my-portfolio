import { absoluteUrl, siteConfig } from "@/src/lib/agent-ready/site"

export const dynamic = "force-static"

export async function GET() {
  return Response.json(
    {
      server_card: absoluteUrl(siteConfig.mcpServerCardPath),
    },
    {
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    }
  )
}
