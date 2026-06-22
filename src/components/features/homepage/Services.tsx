import { Code2, ShoppingBag, Gauge } from "lucide-react";
import Section from "@/src/components/ui/Section";
import { useTranslations } from "next-intl";

const items = [
  { icon: Code2, key: "webapp" },
  { icon: ShoppingBag, key: "ecommerce" },
  { icon: Gauge, key: "performance" },
];

export default function Services() {
  const t = useTranslations("services");

  return (
    <Section variant="transparent" className="py-20 sm:py-28 relative overflow-hidden" id="services">
      <div className="container relative mx-auto px-4">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <p className="text-xs font-semibold tracking-widest uppercase text-primary/70 mb-4">
            {t("label")}
          </p>
          <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            {t("title_part1")} <span className="text-primary">{t("title_part2")}</span>
          </h3>
          <p className="text-base text-muted-foreground leading-relaxed">
            {t("description")}
          </p>
        </div>

        {/* Services — horizontal list on desktop, stacked on mobile */}
        <div className="space-y-4">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.key}
                className="group relative flex flex-col sm:flex-row sm:items-start gap-5 p-6 sm:p-8 rounded-xl border border-border/40 bg-card/20 hover:border-primary/20 hover:bg-card/30 transition-all duration-300"
              >
                <div className="flex-shrink-0 p-3 rounded-lg bg-primary/8 text-primary border border-primary/10">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-semibold text-foreground mb-2">
                    {t(`items.${item.key}.title`)}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 max-w-xl">
                    {t(`items.${item.key}.description`)}
                  </p>
                  <div className="flex flex-wrap gap-x-6 gap-y-2">
                    {[1, 2, 3].map((i) => (
                      <span key={i} className="text-xs font-medium text-muted-foreground/70 flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-primary/40" />
                        {t(`items.${item.key}.features.${i}`)}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
