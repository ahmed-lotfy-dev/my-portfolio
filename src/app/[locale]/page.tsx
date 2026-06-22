import nextDynamic from "next/dynamic";
import { Suspense } from "react";
import ProjectsSkeleton from "@/src/components/skeletons/ProjectsSkeleton";
import Hero from "@/src/components/features/homepage/Hero";
import About from "@/src/components/features/homepage/About";
import Services from "@/src/components/features/homepage/Services";
import Projects from "@/src/components/features/homepage/Projects";
import { HomeSectionBand } from "@/src/components/features/homepage/HomeSectionBand";
import ScrollReveal from "@/src/components/shared/ScrollReveal";

const TechStack = nextDynamic(() => import("@/src/components/features/homepage/TechStack"), {
  loading: () => <div className="min-h-[400px]" />,
});
const Experience = nextDynamic(() => import("@/src/components/features/homepage/Experience"), {
  loading: () => <div className="min-h-[400px]" />,
});
const Contact = nextDynamic(() => import("@/src/components/features/homepage/Contact"), {
  loading: () => <div className="min-h-[300px]" />,
});
// const Testimonials = nextDynamic(() => import("@/src/components/features/homepage/Testimonials"), {
//   loading: () => <div className="min-h-[300px]" />,
// });

import Container from "@/src/components/ui/Container";
import { getTranslations, setRequestLocale } from "next-intl/server";
import StructuredData from "@/src/components/seo/StructuredData";
import { routing } from "@/src/i18n/routing";

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
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${baseUrl}/${locale}`,
      siteName: 'Ahmed Lotfy Portfolio',
      locale: locale === 'ar' ? 'ar_EG' : 'en_US',
      type: 'website',
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: t("title"),
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t("title"),
      description: t("description"),
      creator: '@ahmedlotfy_dev',
      images: [`${baseUrl}/og-image.png`],
    },
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        en: `${baseUrl}/en`,
        ar: `${baseUrl}/ar`,
        "x-default": `${baseUrl}/en`,
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
    <main className="font-main min-h-screen bg-background text-foreground">
      <StructuredData
        type="Person"
        data={{
          name: 'Ahmed Lotfy',
          url: 'https://ahmedlotfy.site',
          image: 'https://ahmedlotfy.site/ahmed-lotfy.jpg',
          jobTitle: 'Senior Full-Stack Software Engineer',
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
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: 'https://ahmedlotfy.site/{locale}/blogs?tag={search_term_string}',
            },
            'query-input': 'required name=search_term_string',
          },
        }}
      />
      <StructuredData
        type="FAQ"
        data={{
          questions: [
            {
              question: locale === 'ar'
                ? 'هل تبني تطبيقات ويب مخصصة؟'
                : 'Do you build custom web applications?',
              answer: locale === 'ar'
                ? 'نعم، أبني تطبيقات ويب قابلة للتطوير وآمنة باستخدام Next.js و Cloudflare. مثالية للـ SaaS والأدوات الداخلية للشركات.'
                : 'Yes, I build scalable, secure web applications with Next.js and Cloudflare. Perfect for SaaS platforms and internal tools.',
            },
            {
              question: locale === 'ar'
                ? 'هل تحسن متاجر إلكترونية قائمة؟'
                : 'Do you optimize existing e-commerce stores?',
              answer: locale === 'ar'
                ? 'نعم، أحسن تجربة التسوق عبر تحسين سرعة الموقع وتدفق الدفع باستخدام Next.js مع Paymob أو Stripe لزيادة المبيعات.'
                : 'Yes, I boost sales by optimizing checkout flows and page speed with Next.js + Paymob/Stripe integration to maximize conversions.',
            },
            {
              question: locale === 'ar'
                ? 'هل تبني تطبيقات موبايل باستخدام React Native؟'
                : 'Do you build mobile apps with React Native?',
              answer: locale === 'ar'
                ? 'نعم، أطور تطبيقات موبايل عبر المنصات باستخدام React Native و Expo مع مزامنة بدون إنترنت.'
                : 'Yes, I build cross-platform mobile apps using React Native and Expo with offline-first sync capabilities.',
            },
            {
              question: locale === 'ar'
                ? 'هل تقدم استشارات في هندسة البرمجيات؟'
                : 'Do you offer software architecture consulting?',
              answer: locale === 'ar'
                ? 'نعم، أساعد الفرق في اختيار التقنيات المناسبة، تصميم البنية التحتية، وتحسين أداء التطبيقات الحالية.'
                : 'Yes, I help teams choose the right tech stack, design infrastructure, and optimize existing application performance.',
            },
          ],
        }}
      />

      <Hero />

      <Container>
        <div className="space-y-6 py-12 lg:py-20">
          <ScrollReveal>
            <div className="snap-section">
              <HomeSectionBand variant="warm">
                <Services />
                <TechStack />
              </HomeSectionBand>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="snap-section">
              <HomeSectionBand variant="editorial">
                <Experience />
                <Suspense fallback={<ProjectsSkeleton />}>
                  <Projects />
                </Suspense>
              </HomeSectionBand>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="snap-section">
              <HomeSectionBand variant="deep">
                <About />
              </HomeSectionBand>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <div className="snap-section">
              <HomeSectionBand variant="warm">
                <Contact />
              </HomeSectionBand>
            </div>
          </ScrollReveal>
        </div>
      </Container>
    </main>
  );
}
