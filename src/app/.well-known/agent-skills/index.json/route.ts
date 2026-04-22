import {
  getAgentSkillDigest,
  getAgentSkills,
  getAgentSkillUrl,
} from "@/src/lib/agent-ready/skills"

export const dynamic = "force-static"

export async function GET() {
  const skills = getAgentSkills().map((skill) => ({
    name: skill.name,
    type: skill.type,
    description: skill.description,
    url: getAgentSkillUrl(skill.slug),
    sha256: getAgentSkillDigest(skill.content),
  }))

  return Response.json(
    {
      $schema: "https://agentskills.io/schemas/agent-skills-v0.2.0.json",
      version: "0.2.0",
      skills,
    },
    {
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    }
  )
}
