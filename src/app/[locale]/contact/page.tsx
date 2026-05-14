import Contact from "@/src/components/features/homepage/Contact";
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
  const t = await getTranslations({ locale, namespace: "metadata.contact" });
  const baseUrl = "https://ahmedlotfy.site";
  const title = t("title");
  const description = t("description");

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/contact`,
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
      canonical: `${baseUrl}/${locale}/contact`,
      languages: {
        en: `${baseUrl}/en/contact`,
        ar: `${baseUrl}/ar/contact`,
        "x-default": `${baseUrl}/en/contact`,
      },
    },
  };
}

export default async function ContactPage({
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
          { label: locale === "ar" ? "تواصل" : "Contact", url: `/${locale}/contact` },
        ]}
      />

      <div className="pt-24 md:pt-32">
        <BackButton href={`/${locale}`} label={locale === "ar" ? "العودة للرئيسية" : "Back to Home"} locale={locale} />
      </div>

      <Contact />
    </main>
  );
}
