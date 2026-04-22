import { absoluteUrl, siteConfig } from "@/src/lib/agent-ready/site"

export const dynamic = "force-static"

export async function GET() {
  const body = {
    openapi: "3.1.0",
    info: {
      title: `${siteConfig.name} Public API`,
      version: "1.0.0",
      description:
        "Minimal public API description for agent discovery. Covers the health endpoint and discovery resources exposed by the site.",
    },
    servers: [
      {
        url: siteConfig.baseUrl,
      },
    ],
    paths: {
      [siteConfig.healthPath]: {
        get: {
          summary: "Health check",
          operationId: "getHealth",
          responses: {
            "200": {
              description: "Service health payload",
            },
          },
        },
      },
      [siteConfig.apiCatalogPath]: {
        get: {
          summary: "API catalog discovery document",
          operationId: "getApiCatalog",
          responses: {
            "200": {
              description: "API linkset document",
            },
          },
        },
      },
      [siteConfig.oauthAuthorizationServerPath]: {
        get: {
          summary: "OAuth authorization server discovery metadata",
          operationId: "getOAuthAuthorizationServerMetadata",
          responses: {
            "200": {
              description: "Authorization server discovery document",
            },
          },
        },
      },
    },
  }

  return Response.json(body, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Link: `<${absoluteUrl(siteConfig.apiCatalogPath)}>; rel="service-doc"`,
    },
  })
}
