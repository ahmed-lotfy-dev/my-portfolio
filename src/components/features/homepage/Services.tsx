import { Code2, ShoppingBag, Gauge, ArrowUpRight } from "lucide-react";
import Section from "@/src/components/ui/Section";
import { useTranslations } from "next-intl";

const items = [
  { icon: Code2, key: "webapp", gradient: "from-blue-500/20 to-indigo-500/10", border: "border-blue-500/20", iconBg: "bg-blue-500/10 text-blue-400" },
  { icon: ShoppingBag, key: "ecommerce", gradient: "from-purple-500/20 to-pink-500/10", border: "border-purple-500/20", iconBg: "bg-purple-500/10 text-purple-400" },
  { icon: Gauge, key: "performance", gradient: "from-cyan-500/20 to-teal-500/10", border: "border-cyan-500/20", iconBg: "bg-cyan-500/10 text-cyan-400" },
];

export default function Services() {
  const t = useTranslations("services");

  return (
    <Section variant="transparent" className="py-24 sm:py-32 relative overflow-hidden" id="services">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container relative mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <p className="text-xs font-bold tracking-widest uppercase text-primary/70 mb-4">
            {t("label")}
          </p>
          <h3 className="text-3xl md:text-5xl font-black tracking-tight text-foreground mb-5">
            {t("title_part1")}{" "}
            <span className="bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              {t("title_part2")}
            </span>
          </h3>
          <p className="text-base text-muted-foreground leading-relaxed">
            {t("description")}
          </p>
        </div>

        {/* Cards — 3 column grid with gradient borders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.key}
                className={`group relative p-8 rounded-2xl border ${item.border} bg-gradient-to-br ${item.gradient} backdrop-blur-sm hover:scale-[1.02] transition-all duration-500`}
              >
                {/* Icon */}
                <div className={`mb-6 inline-flex p-4 rounded-xl ${item.iconBg} group-hover:scale-110 transition-transform duration-300`}>
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
                    <li key={i} className="flex items-center gap-2.5 text-sm text-foreground/70">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                      {t(`items.${item.key}.features.${i}`)}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center gap-1.5 text-xs font-semibold text-primary/70 group-hover:text-primary transition-colors">
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
