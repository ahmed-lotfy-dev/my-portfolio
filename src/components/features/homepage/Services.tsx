import { Code, Database, DeviceMobile } from "@phosphor-icons/react/dist/ssr";
import { useTranslations } from "next-intl";

const items = [
  { icon: Code, key: "webapp", index: "01" },
  { icon: Database, key: "backend", index: "02" },
  { icon: DeviceMobile, key: "mobile", index: "03" },
];

export default function Services() {
  const t = useTranslations("services");

  return (
    <section
      id="services"
      className="relative border-b border-white/[0.07] px-6 py-24 md:px-8 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow">{t("label")}</p>
            <h2 className="mt-5 text-4xl font-semibold leading-[1.05] text-foreground sm:text-5xl">
              {t("title_part1")}{" "}
              <span className="text-muted-foreground">{t("title_part2")}</span>
            </h2>
          </div>
          <p className="max-w-md text-base leading-relaxed text-muted-foreground lg:col-span-5 lg:justify-self-end">
            {t("description")}
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-4 lg:grid-cols-12 lg:grid-rows-2">
          {items.map((item, index) => (
            <article
              key={item.key}
              className={`group relative flex flex-col rounded-3xl border border-white/[0.07] bg-card p-8 transition-colors duration-300 ease-brand hover:bg-[#181818] md:p-10 ${
                index === 0 ? "lg:col-span-7 lg:row-span-2" : "lg:col-span-5"
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.08] text-primary">
                  <item.icon size={20} weight="regular" />
                </span>
                <span className="font-mono text-xs tracking-[0.16em] text-muted-foreground/60">
                  {item.index}
                </span>
              </div>

              <div className={index === 0 ? "mt-10 lg:mt-16" : "mt-8"}>
                <h3 className="text-2xl font-semibold text-foreground">
                  {t(`items.${item.key}.title`)}
                </h3>
                <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-muted-foreground">
                  {t(`items.${item.key}.description`)}
                </p>
              </div>

              <ul className={index === 0 ? "mt-8 space-y-3 lg:mt-auto lg:pt-12" : "mt-6 space-y-3"}>
                {[1, 2, 3].map((i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-foreground/75">
                    <span className="h-px w-4 shrink-0 bg-primary/70" />
                    {t(`items.${item.key}.features.${i}`)}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
