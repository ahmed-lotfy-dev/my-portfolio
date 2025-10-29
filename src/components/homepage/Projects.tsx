import Image from "next/image";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { getAllProjects } from "@/src/app/actions/projectsActions";
import Section from "@/src/components/ui/Section";
import ReadMoreText from "@/src/components/ui/ReadMoreText";
import ImageViewer from "@/src/components/ui/ImageViewer";
import { getTranslations, getLocale } from "next-intl/server";

export default async function Projects() {
  const { allProjects } = await getAllProjects();
  const t = await getTranslations("projects");
  const locale = await getLocale();

  const isRTL = locale === "ar";

  return (
    <Section className="flex flex-col items-center p-4" id="projects">
      <div className="container">
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-foreground dark:text-blue-700 tracking-tight  [font-variation-settings:'wght'_800]">
            {t("title")}
          </h2>
          <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto px-2 sm:px-0">
            {t("description")}
          </p>
        </div>
        <div className="w-full grid gap-8 grid-cols-[repeat(auto-fit,minmax(280px,1fr))] justify-items-stretch">
          {allProjects?.map((proj) => (
            <Card
              key={proj.id}
              className="flex h-full flex-col justify-between overflow-hidden hover:shadow-md transition-shadow duration-300"
            >
              <ImageViewer
                imageUrl={proj.imageLink}
                altText={locale === "ar" ? proj.title_ar : proj.title_en}
                trigger={
                  <div className="relative w-full h-72 cursor-pointer">
                    <Image
                      src={proj.imageLink}
                      alt={locale === "ar" ? proj.title_ar : proj.title_en}
                      fill
                      unoptimized={
                        proj.imageLink?.toLowerCase().endsWith(".gif")
                          ? true
                          : undefined
                      }
                      className={
                        proj.categories?.includes("mobile") ||
                        proj.categories?.includes("app")
                          ? "object-contain"
                          : "object-cover"
                      }
                    />
                  </div>
                }
              />
              <div className="p-6 flex flex-col grow">
                <h3 className="text-2xl font-bold mb-2">
                  {locale === "ar" ? proj.title_ar : proj.title_en}
                </h3>
                <ReadMoreText
                  text={locale === "ar" ? proj.desc_ar : proj.desc_en}
                  maxLines={5}
                  className="text-muted-foreground grow"
                />
                <div className="mt-4 flex justify-end gap-4">
                  <Link href={proj.liveLink} target="_blank">
                    <Button>
                      {proj.categories?.includes("mobile") ||
                      proj.categories?.includes("app")
                        ? t("apk")
                        : t("live")}
                    </Button>
                  </Link>
                  <Link href={proj.repoLink} target="_blank">
                    <Button variant="outline">{t("repo")}</Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Section>
  );
}
