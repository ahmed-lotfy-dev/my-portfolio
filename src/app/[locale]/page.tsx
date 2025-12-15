import { Suspense } from "react";
import Certificates from "@/src/components/features/homepage/Certificates";
import ProjectsSkeleton from "@/src/components/skeletons/ProjectsSkeleton";
import CertificatesSkeleton from "@/src/components/skeletons/CertificatesSkeleton";
import Hero from "@/src/components/features/homepage/Hero";
import Projects from "@/src/components/features/homepage/Projects";
import Skills from "@/src/components/features/homepage/Skills";
import About from "@/src/components/features/homepage/About";
import Contact from "@/src/components/features/homepage/Contact";
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
    keywords: 'Ahmed Lotfy, Full Stack Developer, Next.js, React, TypeScript, Node.js, PostgreSQL, Web Development, Software Engineer, Portfolio, مطور ويب, مطور برمجيات',
    authors: [{ name: 'Ahmed Lotfy', url: baseUrl }],
    creator: 'Ahmed Lotfy',
    publisher: 'Ahmed Lotfy',
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${baseUrl}/${locale}`,
      siteName: 'Ahmed Lotfy Portfolio',
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
        'en': '/en',
        'ar': '/ar',
      },
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
    <Container className="font-main min-h-screen bg-background text-foreground">
      {/* Structured Data for SEO */}
      <StructuredData
        type="Person"
        data={{
          name: 'Ahmed Lotfy',
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
          name: 'Ahmed Lotfy Portfolio',
          url: 'https://ahmedlotfy.site',
          description: locale === 'ar'
            ? 'معرض أعمال أحمد لطفي - مطور ويب متخصص في بناء تطبيقات ويب حديثة'
            : 'Ahmed Lotfy Portfolio - Full Stack Developer building modern web applications',
          languages: ['en', 'ar'],
          authorName: 'Ahmed Lotfy',
        }}
      />

      <Hero locale={locale} />
      <Skills />
      <Suspense fallback={<ProjectsSkeleton />}>
        <Projects />
      </Suspense>
      <Suspense fallback={<CertificatesSkeleton />}>
        <Certificates />
      </Suspense>
      <About />
      <Contact />
    </Container>
  );
}
