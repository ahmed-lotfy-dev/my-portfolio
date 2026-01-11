"use client";

import { motion } from "framer-motion";
import { Code2, ShoppingBag, Gauge, ArrowRight } from "lucide-react";
import Section from "@/src/components/ui/Section";
import { useTranslations } from "next-intl";
import { cn } from "@/src/lib/utils";

const items = [
  {
    icon: Code2,
    key: "webapp",
  },
  {
    icon: ShoppingBag,
    key: "ecommerce",
  },
  {
    icon: Gauge,
    key: "performance",
  },
];

export default function Services() {
  const t = useTranslations("services");

  return (
    <Section variant="surface" className="py-24 sm:py-32 relative overflow-hidden" id="services">
      {/* Background Decor - Mesh Gradient */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none translate-y-1/2 -translate-x-1/2" />

      <div className="container relative mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium tracking-wide uppercase border border-primary/20 backdrop-blur-sm mb-6"
          >
            {t("label")}
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-6"
          >
            {t("title_part1")} <span className="text-primary">{t("title_part2")}</span>
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground leading-relaxed"
          >
            {t("description")}
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 + 0.3 }}
              whileHover={{ y: -10 }}
              className="group relative p-8 rounded-4xl border border-border/50 bg-card/30 backdrop-blur-sm hover:border-primary/50 hover:bg-card/50 transition-all duration-300"
            >
              <div className="mb-6 inline-flex p-4 rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
                <item.icon className="w-8 h-8" />
              </div>

              <h4 className="text-2xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors">
                {t(`items.${item.key}.title`)}
              </h4>

              <p className="text-muted-foreground mb-8 leading-relaxed">
                {t(`items.${item.key}.description`)}
              </p>

              <ul className="space-y-3 mb-8">
                {[1, 2, 3].map((i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-foreground/80">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {t(`items.${item.key}.features.${i}`)}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
