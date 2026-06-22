import { Code2, ShoppingBag, Gauge, ArrowUpRight } from "lucide-react";
import Section from "@/src/components/ui/Section";
import { useTranslations } from "next-intl";

const items = [
  {
    key: "webapp",
    icon: Code2,
    iconBg: "bg-blue-600/10 text-blue-400 border-blue-500/15",
    border: "border-blue-500/8",
  },
  {
    key: "ecommerce",
    icon: ShoppingBag,
    iconBg: "bg-sky-600/10 text-sky-400 border-sky-500/15",
    border: "border-sky-500/8",
  },
  {
    key: "performance",
    icon: Gauge,
    iconBg: "bg-indigo-600/10 text-indigo-400 border-indigo-500/15",
    border: "border-indigo-500/8",
  },
];

export default function Services() {
  const t = useTranslations("services");

  return (
    <Section
      variant="transparent"
      className="relative overflow-hidden"
      id="services"
    >
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/[0.03] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-sky-500/[0.03] rounded-full blur-[120px] pointer-events-none" />

      <div className="container relative mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold tracking-widest uppercase border border-blue-500/15 mb-5">
            {t("label")}
          </div>
          <h3 className="text-3xl md:text-5xl font-black tracking-tight text-foreground mb-5">
            {t("title_part1")}{" "}
            <span className="bg-linear-to-r from-blue-400 via-sky-400 to-indigo-400 bg-clip-text text-transparent">
              {t("title_part2")}
            </span>
          </h3>
          <p className="text-base text-muted-foreground leading-relaxed">
            {t("description")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.key}
                className={`group relative p-8 rounded-2xl border card-blue ${item.border} hover:scale-[1.02] transition-all duration-500`}
              >
                <div
                  className={`mb-6 inline-flex p-4 rounded-xl border ${item.iconBg} group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="w-7 h-7" />
                </div>

                <h4 className="text-xl font-bold mb-3 text-foreground">
                  {t(`items.${item.key}.title`)}
                </h4>

                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  {t(`items.${item.key}.description`)}
                </p>

                <ul className="space-y-2.5 mb-6">
                  {[1, 2, 3].map((i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2.5 text-sm text-foreground/70"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500/60" />
                      {t(`items.${item.key}.features.${i}`)}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-400/70 group-hover:text-blue-400 transition-colors">
                  Learn more
                  <ArrowUpRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </Section>
  );
}