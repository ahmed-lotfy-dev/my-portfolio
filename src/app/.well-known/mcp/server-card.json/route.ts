import { absoluteUrl, siteConfig } from "@/src/lib/agent-ready/site"

export const dynamic = "force-static"

function getServerCard() {
  return {
    serverInfo: {
      name: siteConfig.name,
      version: "1.0.0",
    },
    description:
      "Discovery metadata for Ahmed Shoman's portfolio. Browser-native tools are exposed through WebMCP, and well-known documents describe the current public API and auth surface.",
    transport: {
      type: "webmcp",
      url: absoluteUrl("/"),
    },
    capabilities: {
      tools: true,
      auth: true,
      discovery: true,
    },
    documentationUrl: siteConfig.repositoryUrl,
    wellKnown: {
      apiCatalog: absoluteUrl(siteConfig.apiCatalogPath),
      openIdConfiguration: absoluteUrl(siteConfig.oidcConfigurationPath),
      oauthAuthorizationServer: absoluteUrl(siteConfig.oauthAuthorizationServerPath),
      oauthProtectedResource: absoluteUrl(siteConfig.oauthProtectedResourcePath),
      agentSkills: absoluteUrl(siteConfig.agentSkillsIndexPath),
    },
  }
}

export async function GET() {
  return Response.json(getServerCard(), {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  })
}
