import Link from "next/link";
import Image from "next/image";
import HeroImage from "@/public/images/modern_developer_hero.png";
import Section from "@/src/components/ui/Section";
import { FileText } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";

export default async function Hero({}) {
  const t = await getTranslations("hero");
  const locale = await getLocale();

  return (
    <section
      className="relative overflow-hidden bg-background py-20 sm:py-32"
      id="hero"
    >
      <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-background to-accent/10 opacity-50" />
      <div className="container relative mx-auto flex flex-col-reverse gap-12 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-6 text-center lg:text-left lg:w-1/2">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-primary tracking-wide uppercase">
              {t("title")}
            </h2>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-foreground font-main">
              {t("name")}
            </h1>
          </div>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            {t("description")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-4">
            <Link
              href="/Ahmed-Lotfy-CV.pdf"
              download
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <FileText className="h-5 w-5" />
              <span>{t("resume")}</span>
            </Link>
            <Link
              href="#projects"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-input bg-background px-8 py-4 text-lg font-semibold shadow-sm transition-all hover:bg-accent hover:text-accent-foreground hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span>View Work</span>
            </Link>
          </div>
        </div>

        <div className="relative lg:w-1/2 flex justify-center lg:justify-end">
          <div className="relative w-[280px] h-[280px] sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px]">
            <div className="absolute inset-0 rounded-full bg-linear-to-tr from-primary to-accent blur-3xl opacity-30 animate-pulse" />
            <Image
              className={`relative rounded-2xl shadow-2xl object-cover border border-border/50 ${
                locale === "ar" ? "scale-x-[-1]" : ""
              }`}
              src={HeroImage}
              priority={true}
              alt={t("illustrationAlt")}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
