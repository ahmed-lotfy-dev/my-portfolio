import { absoluteUrl, siteConfig } from "@/src/lib/agent-ready/site"

export const dynamic = "force-static"

export async function GET() {
  return Response.json(
    {
      resource: siteConfig.baseUrl,
      authorization_servers: [absoluteUrl(siteConfig.oauthAuthorizationServerPath)],
      scopes_supported: ["openid", "profile", "email", "admin"],
      bearer_methods_supported: ["header"],
      resource_documentation: siteConfig.repositoryUrl,
      "x-protected-paths": [
        absoluteUrl("/en/dashboard"),
        absoluteUrl("/ar/dashboard"),
        absoluteUrl("/api/backup/trigger"),
        absoluteUrl("/api/backup/download"),
      ],
      "x-authentication-model": "interactive-session",
    },
    {
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    }
  )
}
