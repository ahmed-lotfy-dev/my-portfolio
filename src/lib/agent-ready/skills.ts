import { createHash } from "node:crypto"

import { absoluteUrl, siteConfig } from "@/src/lib/agent-ready/site"

export type AgentSkill = {
  slug:
    | "markdown-negotiation"
    | "content-signals"
    | "api-catalog"
    | "oauth-discovery"
    | "oauth-protected-resource"
    | "mcp-server-card"
    | "agent-skills"
    | "webmcp"
  name: string
  type: "documentation"
  description: string
  content: string
}

const skillList: AgentSkill[] = [
  {
    slug: "markdown-negotiation",
    name: "Markdown Negotiation",
    type: "documentation",
    description:
      "Serve a markdown representation of the homepage when agents request text/markdown.",
    content: `# Markdown Negotiation

## Goal
Return markdown for the homepage when the request advertises \`Accept: text/markdown\`.

## Current behavior
- Browsers still receive HTML.
- Agents that request markdown are rewritten to \`${siteConfig.markdownHomePath}\`.
- Responses are served with \`Content-Type: text/markdown; charset=utf-8\`.

## Notes
- The markdown representation is optimized for AI agents.
- The current implementation covers the homepage entry points: \`/\`, \`/en\`, and \`/ar\`.
`,
  },
  {
    slug: "content-signals",
    name: "Content Signals",
    type: "documentation",
    description:
      "Declare AI content usage preferences in robots.txt using Content-Signal directives.",
    content: `# Content Signals

## Goal
Publish AI content preferences in \`robots.txt\`.

## Current behavior
- \`Content-Signal: ai-train=no, search=yes, ai-input=yes\` is included in the root robots file.
- Standard crawl directives continue to apply to all user agents.
`,
  },
  {
    slug: "api-catalog",
    name: "API Catalog",
    type: "documentation",
    description:
      "Expose an RFC 9727 API catalog and OpenAPI description for the public site endpoints.",
    content: `# API Catalog

## Goal
Expose machine-readable API discovery metadata.

## Current behavior
- \`${siteConfig.apiCatalogPath}\` returns \`application/linkset+json\`.
- \`${siteConfig.openApiPath}\` returns a minimal OpenAPI 3.1 description.
- The current public API surface documents the health endpoint and discovery resources.
`,
  },
  {
    slug: "oauth-discovery",
    name: "OAuth Discovery",
    type: "documentation",
    description:
      "Publish discovery documents that describe the site's current interactive auth model.",
    content: `# OAuth Discovery

## Goal
Help agents discover how this site currently handles authentication.

## Current behavior
- \`${siteConfig.oauthAuthorizationServerPath}\` and \`${siteConfig.oidcConfigurationPath}\` are published.
- They describe the current interactive Better Auth login flow.
- They also include extension notes that machine-to-machine OAuth grants are not enabled yet.

## Important
This is discovery scaffolding around the current auth model, not a full public OAuth provider.
`,
  },
  {
    slug: "oauth-protected-resource",
    name: "OAuth Protected Resource",
    type: "documentation",
    description:
      "Describe the site's protected resource metadata for agents inspecting auth requirements.",
    content: `# OAuth Protected Resource

## Goal
Describe which authorization server metadata applies to protected resources on this site.

## Current behavior
- \`${siteConfig.oauthProtectedResourcePath}\` points to the published authorization server metadata.
- It documents the current interactive session-based protection model used for dashboard and backup endpoints.
`,
  },
  {
    slug: "mcp-server-card",
    name: "MCP Server Card",
    type: "documentation",
    description:
      "Publish an MCP server card that points agents to discovery metadata and browser tools.",
    content: `# MCP Server Card

## Goal
Expose machine-readable discovery metadata for agent tooling.

## Current behavior
- \`${siteConfig.mcpServerCardPath}\` publishes a server card.
- The card points to site discovery documents and browser-oriented capabilities.

## Important
The public site currently exposes browser tools through WebMCP. A dedicated remote MCP transport is not enabled yet.
`,
  },
  {
    slug: "agent-skills",
    name: "Agent Skills Discovery",
    type: "documentation",
    description:
      "Publish a skills index with digests so agents can discover the site's agent-facing capabilities.",
    content: `# Agent Skills Discovery

## Goal
Expose a machine-readable index of agent-facing skills.

## Current behavior
- \`${siteConfig.agentSkillsIndexPath}\` returns the skills index.
- Each skill entry includes a stable URL and SHA-256 digest of the skill content.
`,
  },
  {
    slug: "webmcp",
    name: "WebMCP",
    type: "documentation",
    description:
      "Register browser-side tools through navigator.modelContext when WebMCP is available.",
    content: `# WebMCP

## Goal
Expose lightweight browser actions to compatible AI agents.

## Current behavior
- The site registers browser tools on page load when \`navigator.modelContext.provideContext\` is available.
- Tools currently focus on the public portfolio journey, including projects, contact, and resume access.
`,
  },
]

export function getAgentSkills() {
  return skillList
}

export function getAgentSkill(slug: string) {
  return skillList.find((skill) => skill.slug === slug)
}

export function getAgentSkillDigest(content: string) {
  return createHash("sha256").update(content).digest("hex")
}

export function getAgentSkillUrl(slug: AgentSkill["slug"]) {
  return absoluteUrl(`${siteConfig.agentSkillsIndexPath.replace("/index.json", "")}/${slug}`)
}
