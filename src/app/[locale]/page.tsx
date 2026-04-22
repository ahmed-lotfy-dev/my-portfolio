import nextDynamic from "next/dynamic";
import { Suspense } from "react";
import ProjectsSkeleton from "@/src/components/skeletons/ProjectsSkeleton";
import Hero from "@/src/components/features/homepage/Hero";
import About from "@/src/components/features/homepage/About";
import Services from "@/src/components/features/homepage/Services";
import Projects from "@/src/components/features/homepage/Projects";
import { HomeSectionBand } from "@/src/components/features/homepage/HomeSectionBand";

const TechStack = nextDynamic(() => import("@/src/components/features/homepage/TechStack"));
const Experience = nextDynamic(() => import("@/src/components/features/homepage/Experience"));
const Testimonials = nextDynamic(() => import("@/src/components/features/homepage/Testimonials"));
const Contact = nextDynamic(() => import("@/src/components/features/homepage/Contact"));

import Container from "@/src/components/ui/Container";
import { getTranslations, setRequestLocale } from "next-intl/server";
import StructuredData from "@/src/components/seo/StructuredData";
import { routing } from "@/src/i18n/routing";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.home" });
  const baseUrl = 'https://ahmedlotfy.site';

  return {
    title: t("title"),
    description: t("description"),
    keywords: 'Ahmed Shoman, Full Stack Developer, Next.js, React, TypeScript, Node.js, PostgreSQL, Web Development, Software Engineer, Portfolio, مطور ويب, مطور برمجيات',
    authors: [{ name: 'Ahmed Shoman', url: baseUrl }],
    creator: 'Ahmed Shoman',
    publisher: 'Ahmed Shoman',
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${baseUrl}/${locale}`,
      siteName: 'Ahmed Shoman Portfolio',
      locale: locale === 'ar' ? 'ar_EG' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t("title"),
      description: t("description"),
      creator: '@ahmedlotfy_dev',
    },
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        en: `${baseUrl}/en`,
        ar: `${baseUrl}/ar`,
      },
      xDefault: baseUrl,
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="font-main min-h-screen bg-background text-foreground">
      {/* Structured Data for SEO */}
      <StructuredData
        type="Person"
        data={{
          name: 'Ahmed Shoman',
          url: 'https://ahmedlotfy.site',
          image: 'https://ahmedlotfy.site/ahmed-lotfy.jpg',
          jobTitle: 'Full Stack Developer',
          description: locale === 'ar'
            ? 'مطور ويب متخصص في Next.js و React و TypeScript'
            : 'Full Stack Developer specializing in Next.js, React, and TypeScript',
          sameAs: [
            'https://github.com/ahmed-lotfy-dev',
            'https://linkedin.com/in/ahmed-lotfy-dev',
            'https://twitter.com/ahmedlotfy_dev',
          ],
          skills: ['Next.js', 'React', 'TypeScript', 'Node.js', 'PostgreSQL', 'TailwindCSS'],
        }}
      />
      <StructuredData
        type="WebSite"
        data={{
          name: 'Ahmed Shoman Portfolio',
          url: 'https://ahmedlotfy.site',
          description: locale === 'ar'
            ? 'معرض أعمال أحمد شومان - مطور ويب متخصص في بناء تطبيقات ويب حديثة'
            : 'Ahmed Shoman Portfolio - Full Stack Developer building modern web applications',
          languages: ['en', 'ar'],
          authorName: 'Ahmed Shoman',
        }}
      />

      <Hero locale={locale} />

      <Container>
        <div className="space-y-6 py-12 lg:py-20">
          <HomeSectionBand variant="warm">
            <Services />
            <TechStack />
          </HomeSectionBand>

          <HomeSectionBand variant="editorial">
            <Experience />
            <Suspense fallback={<ProjectsSkeleton />}>
              <Projects />
            </Suspense>
          </HomeSectionBand>

          <HomeSectionBand variant="deep">
            <About />
            <Testimonials />
          </HomeSectionBand>

          <HomeSectionBand variant="warm">
            <Contact />
          </HomeSectionBand>
        </div>
      </Container>
    </div>
  );
}
