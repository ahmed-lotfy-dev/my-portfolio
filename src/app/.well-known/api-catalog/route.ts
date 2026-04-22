import { absoluteUrl, siteConfig } from "@/src/lib/agent-ready/site"

export const dynamic = "force-static"

export async function GET() {
  const body = {
    linkset: [
      {
        anchor: absoluteUrl(siteConfig.apiBasePath),
        "service-desc": [
          {
            href: absoluteUrl(siteConfig.openApiPath),
            type: "application/json",
          },
        ],
        "service-doc": [
          {
            href: siteConfig.repositoryUrl,
            type: "text/html",
          },
        ],
        status: [
          {
            href: absoluteUrl(siteConfig.healthPath),
            type: "application/json",
          },
        ],
      },
    ],
  }

  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      "Content-Type": "application/linkset+json; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  })
}
