"use client";

import { useTranslations } from "next-intl";
import Section from "@/src/components/ui/Section";

const techCategories = [
  {
    label: "Frontend",
    items: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  {
    label: "Backend",
    items: ["Node.js", "Bun", "Elysia", "Drizzle ORM"],
    color: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  },
  {
    label: "DevOps",
    items: ["Docker", "Dokploy", "Cloudflare", "PostgreSQL"],
    color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  },
];

export default function TechStack() {
  const t = useTranslations("tech_stack");

  return (
    <Section variant="transparent" className="py-24 sm:py-32 relative overflow-hidden" id="tech-stack">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-bold tracking-widest uppercase text-primary/70 mb-4">
            {t("label")}
          </p>
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
                <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground/50 mb-5">
                  {cat.label}
                </p>
                <div className="flex flex-wrap justify-center gap-2.5">
                  {cat.items.map((item) => (
                    <span
                      key={item}
                      className={`px-4 py-2 rounded-full text-sm font-medium border ${cat.color} hover:scale-105 transition-transform duration-200`}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-16 text-center text-xs font-bold text-muted-foreground/30 tracking-widest uppercase">
          {t("footer")}
        </p>
      </div>
    </Section>
  );
}
