import certificatesData from "@/src/data/certificates.json";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/src/i18n/routing";
import Link from "next/link";
import { Award, ExternalLink, FileText } from "lucide-react";
import { ImagePreviewer } from "@/src/components/ui/ImagePreviewer";
import StructuredData from "@/src/components/seo/StructuredData";
import { BackButton } from "@/src/components/ui/BackButton";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.certificates" });
  const baseUrl = "https://ahmedlotfy.site";

  return {
    title: t("title"),
    description: t("description"),
    keywords: "certificates, certifications, courses, learning, professional development, Ahmed Lotfy",
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${baseUrl}/${locale}/certificates`,
      siteName: "Ahmed Lotfy Portfolio",
      locale: locale === "ar" ? "ar_EG" : "en_US",
      type: "website",
      images: [{ url: `${baseUrl}/og-image.png`, width: 1200, height: 630, alt: t("title") }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      creator: "@ahmedlotfy_dev",
      images: [`${baseUrl}/og-image.png`],
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/certificates`,
      languages: { en: `${baseUrl}/en/certificates`, ar: `${baseUrl}/ar/certificates`, "x-default": `${baseUrl}/en/certificates` },
    },
  };
}

export default async function CertificatesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("certificates");
  const isArabic = locale === "ar";
  const publishedCerts = certificatesData.filter((c) => c.published !== false);

  return (
    <main className="min-h-screen pb-20 bg-background text-foreground selection:bg-primary/20">
      <StructuredData
        type="CollectionPage"
        data={{
          name: "Professional Certificates - Ahmed Lotfy",
          description: "Collection of professional development certificates and courses completed by Ahmed Lotfy",
          url: `https://ahmedlotfy.site/${locale}/certificates`,
          numberOfItems: publishedCerts.length,
        }}
      />

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 blur-[100px] rounded-full mix-blend-screen opacity-50" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-accent/40 blur-[100px] rounded-full mix-blend-screen opacity-50" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 pt-24 md:pt-32">
        <BackButton href={`/${locale}`} label={t("back_to_home")} locale={locale} />

        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium tracking-wide uppercase border border-primary/20 backdrop-blur-sm mb-4">
            <Award className="w-4 h-4" />
            <span>{t("title")}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground tracking-tight">
            {t("page_title")}
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("page_description")}
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Award className="w-4 h-4" />
            <span>{publishedCerts.length} {t("total_certificates")}</span>
          </div>
        </div>

        {publishedCerts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {publishedCerts.map((cert, index) => (
              <div
                key={cert.id}
                className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card/50 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-muted/50 block">
                  {cert.image_link ? (
                    <ImagePreviewer
                      images={cert.image_link}
                      title={cert.title}
                      className="w-full h-full mb-0"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                      <Award className="h-12 w-12 opacity-20" />
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-6 gap-3">
                  <h3 className="font-semibold text-xl leading-tight text-foreground line-clamp-2 min-h-14" title={cert.title}>
                    <span className="hover:text-primary transition-colors">{cert.title}</span>
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium">{cert.desc}</p>

                  {cert.completedAt && (
                    <p className="text-xs text-muted-foreground">
                      {t("completed")}:{" "}
                      {new Date(cert.completedAt).toLocaleDateString(
                        isArabic ? "ar-EG" : "en-US",
                        { year: "numeric", month: "short" }
                      )}
                    </p>
                  )}

                  <div className="mt-auto pt-4 flex items-center justify-between border-t border-border">
                    <div className="flex gap-2 items-center">
                      {cert.courseLink && (
                        <Link
                          href={cert.courseLink}
                          target="_blank"
                          className="p-2 rounded-full bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                          title={t("table.view_course")}
                        >
                          <ExternalLink size={16} />
                        </Link>
                      )}
                      {cert.profLink && cert.profLink.trim() !== "" && (
                        <Link
                          href={cert.profLink}
                          target="_blank"
                          className="p-2 rounded-full bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                          title={t("table.proof")}
                        >
                          <FileText size={16} />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Award className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-20" />
            <p className="text-muted-foreground text-lg">{t("no_certificates")}</p>
          </div>
        )}
      </div>
    </main>
  );
}
