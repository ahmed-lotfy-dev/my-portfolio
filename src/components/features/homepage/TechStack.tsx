"use client";

import { useTranslations } from "next-intl";
import Section from "@/src/components/ui/Section";

const techCategories = [
  {
    label: "Frontend",
    items: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    color:
      "bg-blue-600/10 text-blue-400 border-blue-500/15 hover:border-blue-500/30 hover:bg-blue-600/15",
  },
  {
    label: "Backend",
    items: ["Node.js", "Bun", "Elysia", "Drizzle ORM"],
    color:
      "bg-sky-600/10 text-sky-400 border-sky-500/15 hover:border-sky-500/30 hover:bg-sky-600/15",
  },
  {
    label: "DevOps",
    items: ["Docker", "Dokploy", "Cloudflare", "PostgreSQL"],
    color:
      "bg-indigo-600/10 text-indigo-400 border-indigo-500/15 hover:border-indigo-500/30 hover:bg-indigo-600/15",
  },
];

export default function TechStack() {
  const t = useTranslations("tech_stack");

  return (
    <Section
      variant="transparent"
      className="relative overflow-hidden"
      id="tech-stack"
    >
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-600/[0.03] rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold tracking-widest uppercase border border-blue-500/15 mb-5">
            {t("label")}
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-foreground mb-5">
            {t("title")}
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            {t("description")}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-12">
            {techCategories.map((cat) => (
              <div key={cat.label} className="text-center">
                <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground/40 mb-5">
                  {cat.label}
                </p>
                <div className="flex flex-wrap justify-center gap-2.5">
                  {cat.items.map((item) => (
                    <span
                      key={item}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-300 hover:scale-105 ${cat.color}`}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-16 text-center text-xs font-bold text-muted-foreground/20 tracking-widest uppercase">
          {t("footer")}
        </p>
      </div>
    </Section>
  );
}