import enMessages from "@/src/messages/en.json"
import arMessages from "@/src/messages/ar.json"
import { absoluteUrl, localizedPath, siteConfig } from "@/src/lib/agent-ready/site"

type Locale = (typeof siteConfig.locales)[number]

const messagesByLocale = {
  en: enMessages,
  ar: arMessages,
} as const

function listValues(record: Record<string, string>) {
  return Object.values(record)
}

export function getHomepageMarkdown(locale: Locale) {
  const messages = messagesByLocale[locale]
  const directionLine = locale === "ar" ? "> اللغة: العربية" : "> Language: English"
  const siteUrl = absoluteUrl(localizedPath(locale))
  const projectsUrl = absoluteUrl(localizedPath(locale, "/projects"))
  const blogUrl = absoluteUrl(localizedPath(locale, "/blogs"))
  const certificatesUrl = absoluteUrl(localizedPath(locale, "/certificates"))
  const privacyUrl = absoluteUrl(localizedPath(locale, "/privacy"))
  const termsUrl = absoluteUrl(localizedPath(locale, "/terms"))
  const resumeUrl = absoluteUrl(siteConfig.resumePath)

  return [
    `# ${messages.hero.name}`,
    "",
    directionLine,
    "",
    `**${messages.hero.title}**`,
    "",
    messages.hero.description,
    "",
    "## Quick Links",
    "",
    `- Home: ${siteUrl}`,
    `- Projects: ${projectsUrl}`,
    `- Blog: ${blogUrl}`,
    `- Certificates: ${certificatesUrl}`,
    `- Resume: ${resumeUrl}`,
    `- Privacy: ${privacyUrl}`,
    `- Terms: ${termsUrl}`,
    "",
    `## ${messages.services.label}`,
    "",
    messages.services.description,
    "",
    ...Object.values(messages.services.items).flatMap((service) => [
      `### ${service.title}`,
      "",
      service.description,
      "",
      ...listValues(service.features).map((feature) => `- ${feature}`),
      "",
    ]),
    `## ${messages.tech_stack.title}`,
    "",
    messages.tech_stack.description,
    "",
    ...Object.values(messages.tech_stack.items).flatMap((item) => [
      `- **${item.title}:** ${item.desc}`,
    ]),
    "",
    `## ${messages.projects.title}`,
    "",
    messages.projects.description,
    "",
    `## ${messages.skills.title}`,
    "",
    messages.skills.description,
    "",
    ...messages.skills.list.map((skill) => `- ${skill}`),
    "",
    `## ${messages.footer.connect}`,
    "",
    `- GitHub: https://github.com/ahmed-lotfy-dev`,
    `- LinkedIn: https://linkedin.com/in/ahmed-lotfy-dev`,
    `- X: https://twitter.com/ahmedlotfy_dev`,
    "",
  ].join("\n")
}
