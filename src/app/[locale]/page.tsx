import Certificates from "@/src/components/homepage/Certificates";
import Hero from "@/src/components/homepage/Hero";
import Projects from "@/src/components/homepage/Projects";
import Skills from "@/src/components/homepage/Skills";
import About from "@/src/components/homepage/About";
import Contact from "@/src/components/homepage/Contact";
import Footer from "@/src/components/homepage/Footer";
import Container from "@/src/components/ui/Container";
import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";
import { getTranslations, setRequestLocale } from "next-intl/server";
import StructuredData from "@/src/components/seo/StructuredData";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
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
  params: { locale: string };
}) {
  const header = await headers();
  const session = await auth.api.getSession({ headers: header });
  const user = session;
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

      <Hero />
      <Skills />
      <Projects />
      <Certificates />
      <About />
      <Contact />
      <Footer />
    </Container>
  );
}
