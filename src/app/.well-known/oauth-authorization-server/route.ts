import { absoluteUrl, siteConfig } from "@/src/lib/agent-ready/site"

export const dynamic = "force-static"

export async function GET() {
  return Response.json(
    {
      issuer: siteConfig.baseUrl,
      authorization_endpoint: absoluteUrl(siteConfig.oauthAuthorizePath),
      token_endpoint: absoluteUrl(siteConfig.oauthTokenPath),
      jwks_uri: absoluteUrl(siteConfig.jwksPath),
      registration_endpoint: null,
      grant_types_supported: ["authorization_code"],
      response_types_supported: ["code"],
      scopes_supported: ["openid", "profile", "email", "admin"],
      token_endpoint_auth_methods_supported: ["none"],
      code_challenge_methods_supported: ["S256"],
      "x-authentication-model": "interactive-session",
      "x-machine-to-machine-supported": false,
      "x-notes":
        "The site currently uses Better Auth for interactive browser sessions. Programmatic OAuth token issuance is not enabled yet.",
    },
    {
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    }
  )
}
