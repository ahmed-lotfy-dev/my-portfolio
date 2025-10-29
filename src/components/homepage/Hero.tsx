import Link from "next/link";
import Image from "next/image";
import HeroImage from "@/public/images/alotfy_Programmer_coding_on_laptop_sitting_on_desk_-_-_v4_styli_9fb2f0c6-7665-4891-b42c-89e8e4c6274b.png";
import Section from "@/src/components/ui/Section";
import { FileText } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Silk from "@/src/components/Silk";

export default async function Hero({}) {
  const t = await getTranslations("hero");

  return (
    <section className="bg-gradient-custom border-b pb-2" id="hero">
      <div className="container mx-auto flex flex-col gap-10 px-4 pt-6 sm:px-6 sm:pt-8 sm:flex-row justify-between items-center max-w-(--breakpoint-xl) min-h-[calc(100svh-64px)]">
        <div className="flex flex-col gap-4 text-center sm:text-start">
          <h1 className="text-5xl md:text-7xl font-extrabold uppercase font-main">
            {t("name")}
          </h1>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">
            {t("title")}
          </h2>
          <p className="text-md md:text-lg text-muted-foreground max-w-2xl mt-4">
            {t("description")}
          </p>
          <Link
            href="/resume.pdf"
            className="inline-flex items-center justify-center gap-2 mt-8 self-center sm:self-start rounded-full px-6 py-3 sm:text-lg font-semibold 
  bg-primary text-white shadow-md hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
          >
            <FileText className="h-5 w-5" />
            <span>{t("resume")}</span>
          </Link>
        </div>
        <div className="relative">
          <Image
            className="rounded-full border-4 border-primary shadow-lg w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] object-cover"
            src={HeroImage}
            priority={true}
            alt={t("illustrationAlt")}
            width={400}
            height={400}
          />
        </div>
      </div>
    </section>
  );
}
