import { NextRequest } from "next/server"

import { getAgentSkill } from "@/src/lib/agent-ready/skills"

export const dynamic = "force-static"

export function generateStaticParams() {
  return [
    { slug: "markdown-negotiation" },
    { slug: "content-signals" },
    { slug: "api-catalog" },
    { slug: "oauth-discovery" },
    { slug: "oauth-protected-resource" },
    { slug: "mcp-server-card" },
    { slug: "agent-skills" },
    { slug: "webmcp" },
  ]
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params
  const skill = getAgentSkill(slug)

  if (!skill) {
    return new Response("Not found", { status: 404 })
  }

  return new Response(skill.content, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  })
}
