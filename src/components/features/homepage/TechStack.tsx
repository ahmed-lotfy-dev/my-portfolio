"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Code, Database, Globe, Layers, Server } from "lucide-react";
import Section from "@/src/components/ui/Section";
import { cn } from "@/src/lib/utils";

export default function TechStack() {
  const t = useTranslations("tech_stack");

  return (
    <Section variant="default" className="py-24 relative overflow-hidden" id="tech-stack">
      {/* Background Decor - Mesh Gradient */}
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none translate-y-1/2 translate-x-1/2" />
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 text-primary mb-4"
          >
            <Layers className="w-5 h-5" />
            <span className="font-bold uppercase tracking-widest text-sm">
              {t("label")}
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black tracking-tight text-foreground"
          >
            {t("title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg text-muted-foreground"
          >
            {t("description")}
          </motion.p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Item 1: Next.js */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0 }}
            whileHover={{ y: -5 }}
            className={cn(
              "group relative overflow-hidden rounded-3xl border border-border/50 p-8 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl",
              "md:col-span-2",
              "bg-linear-to-br from-black/5 to-black/10 dark:from-white/5 dark:to-white/10"
            )}
          >
            <div className="relative z-10 flex flex-col h-full justify-between gap-8">
              <div className="p-3 bg-background/50 w-fit rounded-2xl border border-white/10 backdrop-blur-md">
                <Globe className="w-8 h-8 text-foreground" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2 text-foreground">
                  {t("items.nextjs.title")}
                </h3>
                <p className="text-muted-foreground/80 font-medium">
                  {t("items.nextjs.desc")}
                </p>
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-foreground/5 rounded-full blur-3xl group-hover:bg-foreground/10 transition-colors duration-500" />
          </motion.div>

          {/* Item 2: TypeScript */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -5 }}
            className={cn(
              "group relative overflow-hidden rounded-3xl border border-border/50 p-8 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl",
              "md:col-span-1",
              "bg-blue-500/10"
            )}
          >
            <div className="relative z-10 flex flex-col h-full justify-between gap-8">
              <div className="p-3 bg-background/50 w-fit rounded-2xl border border-white/10 backdrop-blur-md">
                <Code className="w-8 h-8 text-foreground" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2 text-foreground">
                  {t("items.typescript.title")}
                </h3>
                <p className="text-muted-foreground/80 font-medium">
                  {t("items.typescript.desc")}
                </p>
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-foreground/5 rounded-full blur-3xl group-hover:bg-foreground/10 transition-colors duration-500" />
          </motion.div>

          {/* Item 3: Database */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -5 }}
            className={cn(
              "group relative overflow-hidden rounded-3xl border border-border/50 p-8 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl",
              "md:col-span-1",
              "bg-emerald-500/10"
            )}
          >
            <div className="relative z-10 flex flex-col h-full justify-between gap-8">
              <div className="p-3 bg-background/50 w-fit rounded-2xl border border-white/10 backdrop-blur-md">
                <Database className="w-8 h-8 text-foreground" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2 text-foreground">
                  {t("items.database.title")}
                </h3>
                <p className="text-muted-foreground/80 font-medium">
                  {t("items.database.desc")}
                </p>
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-foreground/5 rounded-full blur-3xl group-hover:bg-foreground/10 transition-colors duration-500" />
          </motion.div>

          {/* Item 4: Infra */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -5 }}
            className={cn(
              "group relative overflow-hidden rounded-3xl border border-border/50 p-8 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl",
              "md:col-span-2",
              "bg-orange-500/10"
            )}
          >
            <div className="relative z-10 flex flex-col h-full justify-between gap-8">
              <div className="p-3 bg-background/50 w-fit rounded-2xl border border-white/10 backdrop-blur-md">
                <Server className="w-8 h-8 text-foreground" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2 text-foreground">
                  {t("items.infra.title")}
                </h3>
                <p className="text-muted-foreground/80 font-medium">
                  {t("items.infra.desc")}
                </p>
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-foreground/5 rounded-full blur-3xl group-hover:bg-foreground/10 transition-colors duration-500" />
          </motion.div>
        </div>

        {/* Bottom Tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-sm font-mono text-muted-foreground/60 uppercase tracking-widest">{t("footer")}</p>
        </motion.div>
      </div>
    </Section>
  );
}
