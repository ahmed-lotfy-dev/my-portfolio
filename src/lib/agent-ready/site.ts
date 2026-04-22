export const siteConfig = {
  name: "Ahmed Shoman Portfolio",
  owner: "Ahmed Shoman",
  baseUrl: "https://ahmedlotfy.site",
  repositoryUrl: "https://github.com/ahmed-lotfy-dev/my-portfolio",
  defaultLocale: "en",
  locales: ["en", "ar"] as const,
  apiBasePath: "/api",
  healthPath: "/api/health",
  openApiPath: "/.well-known/openapi.json",
  apiCatalogPath: "/.well-known/api-catalog",
  oauthAuthorizationServerPath: "/.well-known/oauth-authorization-server",
  oidcConfigurationPath: "/.well-known/openid-configuration",
  oauthProtectedResourcePath: "/.well-known/oauth-protected-resource",
  jwksPath: "/.well-known/jwks.json",
  oauthAuthorizePath: "/api/oauth/authorize",
  oauthTokenPath: "/api/oauth/token",
  oauthUserInfoPath: "/api/oauth/userinfo",
  mcpServerCardPath: "/.well-known/mcp/server-card.json",
  agentSkillsIndexPath: "/.well-known/agent-skills/index.json",
  markdownHomePath: "/_agent/home.md",
  loginPath: "/en/login",
  projectsPath: "/en/projects",
  contactPath: "/en#contact",
  resumePath: "/Ahmed-Lotfy-CV.pdf",
} as const

export function absoluteUrl(path: string) {
  return new URL(path, siteConfig.baseUrl).toString()
}

export function localizedPath(locale: "en" | "ar", path = "") {
  const cleanPath = path.startsWith("/") ? path : `/${path}`
  return `/${locale}${cleanPath === "/" ? "" : cleanPath}`
}
