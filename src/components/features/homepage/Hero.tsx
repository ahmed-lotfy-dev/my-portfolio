import Link from "next/link";
import Image from "next/image";
import HeroImage from "@/public/images/optimized/About-Image.webp";
import { FileText, ArrowRight } from "lucide-react";
import { CVDropdown } from "./CVDropdown";
import { getTranslations } from "next-intl/server";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";
import HeroAnimations from "@/src/components/features/homepage/HeroAnimations";

export default async function Hero({ locale }: { locale: string }) {
  const t = await getTranslations("hero");
  const isRTL = locale === "ar";

  return (
    <section
      className="relative overflow-hidden bg-background py-20 sm:py-32"
      id="hero"
    >
      <div className="absolute inset-0 bg-hero-radial from-primary/30 via-background to-background opacity-80" />
      <div className="absolute -top-40 left-1/2 h-[600px] w-[1200px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px] pointer-events-none" />

      <div className="container relative mx-auto flex flex-col-reverse gap-12 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-6 text-center lg:w-1/2 lg:text-start">
          <div className="space-y-4">
            <HeroAnimations delay={0.08} type="fade-up">
              <h2 className="inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium tracking-wide text-primary uppercase backdrop-blur-sm">
                {t("title")}
              </h2>
            </HeroAnimations>

            {/* Removing motion from H1 for instant FCP/LCP */}
            <h1 className="font-main text-4xl leading-tight font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-7xl">
              {t("name")}
            </h1>
          </div>

          <HeroAnimations delay={0.2} type="fade-up">
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl lg:mx-0">
              {t("description")}
            </p>
          </HeroAnimations>

          <HeroAnimations delay={0.26} type="fade-up">
            <div className="flex flex-col gap-6">
              <div className="mt-4 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
                <Button
                  size="lg"
                  className="cursor-pointer rounded-xl px-8 py-6 text-lg shadow-lg shadow-primary/25 hover:shadow-primary/40"
                  asChild
                >
                  <Link href="#contact">
                    <span>{t("book_consultation")}</span>
                    <ArrowRight
                      className={cn("ml-2 h-5 w-5", isRTL && "rotate-180")}
                    />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-xl bg-card/50 px-8 py-6 text-lg backdrop-blur-sm"
                  asChild
                >
                  <Link href="#projects">
                    <span>{t("view_work")}</span>
                  </Link>
                </Button>
              </div>

              <div className="flex justify-center lg:justify-start">
                <CVDropdown>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-muted-foreground transition-colors hover:text-primary"
                  >
                    <FileText className="h-4 w-4" />
                    <span>{t("resume")}</span>
                  </Button>
                </CVDropdown>
              </div>
            </div>
          </HeroAnimations>
        </div>

        <div className="relative flex justify-center lg:w-1/2 lg:justify-end">
          <div className="relative h-[280px] w-[280px] sm:h-[400px] sm:w-[400px] lg:h-[500px] lg:w-[500px]">
            <div className="absolute inset-0 rounded-full bg-linear-to-tr from-primary to-secondary opacity-15 blur-3xl" />
            <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-card/10 shadow-2xl shadow-primary/10 backdrop-blur-sm">
              <Image
                className={`object-cover ${isRTL ? "scale-x-[-1]" : ""}`}
                src={HeroImage}
                priority
                fetchPriority="high"
                quality={75}
                alt={t("illustrationAlt")}
                fill
                sizes="(max-width: 640px) 280px, (max-width: 768px) 400px, 500px"
                placeholder="blur"
              />
            </div>

            <HeroAnimations delay={0.36} type="fade-up">
              <div
                className={`absolute -bottom-6 flex items-center gap-3 rounded-2xl border border-border bg-card/80 p-4 shadow-xl backdrop-blur-xl ${isRTL ? "-right-6 md:-right-10 md:bottom-10" : "-left-6 md:-left-10 md:bottom-10"
                  }`}
              >
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <span className="text-sm font-medium text-foreground">
                  {t("available_work")}
                </span>
              </div>
            </HeroAnimations>
          </div>
        </div>
      </div>
    </section>
  );
}
