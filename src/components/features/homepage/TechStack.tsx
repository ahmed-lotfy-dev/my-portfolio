"use client";

import { useTranslations } from "next-intl";
import { Code, Database, Globe, Layers, Server } from "lucide-react";
import Section from "@/src/components/ui/Section";
import { cn } from "@/src/lib/utils";

export default function TechStack() {
  const t = useTranslations("tech_stack");

  return (
    <Section variant="transparent" className="py-24 relative overflow-hidden" id="tech-stack">
      {/* Background Decor - Mesh Gradient */}
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none translate-y-1/2 translate-x-1/2" />
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <div className="flex items-center gap-2 text-primary mb-4 animate-fade-in-left">
            <Layers className="w-5 h-5" />
            <span className="font-bold uppercase tracking-widest text-sm">
              {t("label")}
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground animate-fade-in-up delay-100">
            {t("title")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground animate-fade-in-up delay-200">
            {t("description")}
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Item 1: Next.js */}
          <div
            className={cn(
              "group relative overflow-hidden rounded-3xl border border-border/50 p-8 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl",
              "md:col-span-2",
              "bg-linear-to-br from-primary/10 via-card/90 to-secondary/70",
              "animate-fade-in-up delay-300"
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
          </div>

          {/* Item 2: TypeScript */}
          <div
            className={cn(
              "group relative overflow-hidden rounded-3xl border border-border/50 p-8 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl",
              "md:col-span-1",
              "bg-linear-to-br from-primary/12 to-secondary/85",
              "animate-fade-in-up delay-400"
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
          </div>

          {/* Item 3: Database */}
          <div
            className={cn(
              "group relative overflow-hidden rounded-3xl border border-border/50 p-8 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl",
              "md:col-span-1",
              "bg-linear-to-br from-secondary/95 to-accent/90",
              "animate-fade-in-up delay-500"
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
          </div>

          {/* Item 4: Infra */}
          <div
            className={cn(
              "group relative overflow-hidden rounded-3xl border border-border/50 p-8 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl",
              "md:col-span-2",
              "bg-linear-to-br from-accent/90 to-primary/10",
              "animate-fade-in-up delay-500"
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
          </div>
        </div>

        {/* Bottom Tagline */}
        <div className="mt-12 text-center animate-fade-in delay-500">
          <p className="text-sm font-mono text-muted-foreground/60 uppercase tracking-widest">{t("footer")}</p>
        </div>
      </div>
    </Section>
  );
}
