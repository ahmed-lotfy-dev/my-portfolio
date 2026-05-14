import About from "@/src/components/features/homepage/About";
import { BreadcrumbSchema } from "@/src/components/seo/BreadcrumbSchema";
import { BackButton } from "@/src/components/ui/BackButton";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/src/i18n/routing";

export const revalidate = 3600;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.about" });
  const baseUrl = "https://ahmedlotfy.site";
  const title = t("title");
  const description = t("description");

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/about`,
      siteName: "Ahmed Lotfy Portfolio",
      locale: locale === "ar" ? "ar_EG" : "en_US",
      type: "website",
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@ahmedlotfy_dev",
      images: [`${baseUrl}/og-image.png`],
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/about`,
      languages: {
        en: `${baseUrl}/en/about`,
        ar: `${baseUrl}/ar/about`,
        "x-default": `${baseUrl}/en/about`,
      },
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen">
      <BreadcrumbSchema
        items={[
          { label: locale === "ar" ? "الرئيسية" : "Home", url: `/${locale}` },
          { label: locale === "ar" ? "عنّي" : "About", url: `/${locale}/about` },
        ]}
      />

      <div className="pt-24 md:pt-32">
        <BackButton href={`/${locale}`} label={locale === "ar" ? "العودة للرئيسية" : "Back to Home"} locale={locale} />
      </div>

      <About />
    </main>
  );
}
