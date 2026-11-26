import { BracketsCurly, Cloud, Database, FileTs } from "@phosphor-icons/react/dist/ssr";
import { useTranslations } from "next-intl";

const items = [
  { key: "nextjs", icon: BracketsCurly, tag: "Framework" },
  { key: "typescript", icon: FileTs, tag: "Language" },
  { key: "database", icon: Database, tag: "Data" },
  { key: "infra", icon: Cloud, tag: "Runtime" },
];

export default function TechStack() {
  const t = useTranslations("tech_stack");

  return (
    <section
      id="tech-stack"
      className="relative border-b border-white/[0.07] px-6 py-24 md:px-8 md:py-32"
    >
      <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4 lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow">{t("label")}</p>
          <h2 className="mt-5 text-4xl font-semibold leading-[1.05] text-foreground sm:text-5xl">
            {t("title")}
          </h2>
          <p className="mt-6 max-w-sm text-base leading-relaxed text-muted-foreground">
            {t("description")}
          </p>
          <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground/60">
            {t("footer")}
          </p>
        </div>

        <ul className="border-t border-white/[0.08] lg:col-span-8">
          {items.map((item, index) => (
            <li
              key={item.key}
              className="group grid grid-cols-[2rem_1fr_auto] items-start gap-5 border-b border-white/[0.08] py-7 transition-colors duration-300 ease-brand hover:bg-white/[0.02] md:gap-8 md:py-8"
            >
              <span className="tabular pt-1 font-mono text-xs text-muted-foreground/60">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="text-lg font-medium text-foreground md:text-xl">
                    {t(`items.${item.key}.title`)}
                  </h3>
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary/80">
                    {item.tag}
                  </span>
                </div>
                <p className="mt-2 max-w-[60ch] text-sm leading-relaxed text-muted-foreground">
                  {t(`items.${item.key}.desc`)}
                </p>
              </div>
              <item.icon
                size={20}
                className="mt-1 text-muted-foreground/50 transition-colors duration-300 group-hover:text-primary"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
