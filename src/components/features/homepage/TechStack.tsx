"use client";

import { useTranslations } from "next-intl";
import Section from "@/src/components/ui/Section";

const techCategories = [
  {
    label: "Frontend",
    items: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
  },
  {
    label: "Backend",
    items: ["Node.js", "Bun", "Elysia", "Drizzle ORM"],
  },
  {
    label: "DevOps",
    items: ["Docker", "Dokploy", "Cloudflare", "PostgreSQL"],
  },
];

export default function TechStack() {
  const t = useTranslations("tech_stack");

  return (
    <Section variant="transparent" className="py-20 sm:py-28 relative overflow-hidden" id="tech-stack">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mb-14">
          <p className="text-xs font-semibold tracking-widest uppercase text-primary/70 mb-4">
            {t("label")}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            {t("title")}
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            {t("description")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-12">
          {techCategories.map((cat) => (
            <div key={cat.label}>
              <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground/50 mb-4">
                {cat.label}
              </p>
              <ul className="space-y-2.5">
                {cat.items.map((item) => (
                  <li key={item} className="text-sm font-medium text-foreground/80">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-14 text-center text-xs font-medium text-muted-foreground/40 tracking-widest uppercase">
          {t("footer")}
        </p>
      </div>
    </Section>
  );
}
