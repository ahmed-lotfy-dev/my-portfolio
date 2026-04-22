import { absoluteUrl, siteConfig } from "@/src/lib/agent-ready/site"

export const dynamic = "force-static"

export async function GET() {
  return Response.json(
    {
      issuer: siteConfig.baseUrl,
      authorization_endpoint: absoluteUrl(siteConfig.oauthAuthorizePath),
      token_endpoint: absoluteUrl(siteConfig.oauthTokenPath),
      jwks_uri: absoluteUrl(siteConfig.jwksPath),
      userinfo_endpoint: absoluteUrl(siteConfig.oauthUserInfoPath),
      response_types_supported: ["code"],
      subject_types_supported: ["public"],
      grant_types_supported: ["authorization_code"],
      scopes_supported: ["openid", "profile", "email", "admin"],
      claims_supported: ["sub", "email", "name"],
      code_challenge_methods_supported: ["S256"],
      token_endpoint_auth_methods_supported: ["none"],
      id_token_signing_alg_values_supported: ["RS256"],
      "x-authentication-model": "interactive-session",
      "x-machine-to-machine-supported": false,
      "x-notes":
        "This discovery document describes the current interactive auth surface. A full OIDC provider is not enabled yet.",
    },
    {
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    }
  )
}
