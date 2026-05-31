import { getSingleCertificate } from "@/src/app/actions/certificates/queries";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { cn } from "@/src/lib/utils";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Award } from "lucide-react";
import { ImagePreviewer } from "@/src/components/ui/ImagePreviewer";
import { Button } from "@/src/components/ui/button";
import StructuredData from "@/src/components/seo/StructuredData";
import { BreadcrumbSchema } from "@/src/components/seo/BreadcrumbSchema";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const { certificate } = await getSingleCertificate(slug);
  const baseUrl = "https://ahmedlotfy.site";

  if (!certificate || !certificate.published) {
    return {
      title: "Certificate Not Found",
      robots: { index: false, follow: true },
    };
  }

  const title = `${certificate.title} - Ahmed Lotfy Certificate`;
  const description = `Professional certificate: ${certificate.title}. Issued by ${certificate.desc}. View details and verification on Ahmed Lotfy's portfolio.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/certificates/${slug}`,
      siteName: "Ahmed Lotfy Portfolio",
      locale: locale === "ar" ? "ar_EG" : "en_US",
      type: "website",
      images: certificate.imageLink
        ? [{ url: certificate.imageLink, width: 1200, height: 630, alt: certificate.title }]
        : [{ url: `${baseUrl}/og-image.png`, width: 1200, height: 630, alt: certificate.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [certificate.imageLink || `${baseUrl}/og-image.png`],
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/certificates/${slug}`,
      languages: {
        en: `${baseUrl}/en/certificates/${slug}`,
        ar: `${baseUrl}/ar/certificates/${slug}`,
        "x-default": `${baseUrl}/en/certificates/${slug}`,
      },
    },
  };
}

export default async function CertificatePage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const { slug } = params;
  const [{ certificate }, locale, t] = await Promise.all([
    getSingleCertificate(slug),
    getLocale(),
    getTranslations("certificates"),
  ]);

  if (!certificate || !certificate.published) {
    return notFound();
  }

  return (
    <article className="min-h-screen pb-20 bg-background text-foreground selection:bg-primary/20">
      <StructuredData
        type="EducationalOccupationalCredential"
        data={{
          title: certificate.title,
          description: certificate.desc,
          image: certificate.imageLink,
          url: `https://ahmedlotfy.site/${locale}/certificates/${slug}`,
          issuingOrganization: certificate.desc,
          educationalLevel: "Professional",
        }}
      />
      <BreadcrumbSchema
        items={[
          { label: "Home", url: `/${locale}` },
          { label: "Certificates", url: `/${locale}/certificates` },
          { label: certificate.title, url: `/${locale}/certificates/${slug}` },
        ]}
      />

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 blur-[100px] rounded-full mix-blend-screen opacity-50" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-accent/40 blur-[100px] rounded-full mix-blend-screen opacity-50" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 pt-24 md:pt-32">
        <Link
          href={`/${locale}/certificates`}
          className="inline-flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors mb-8 md:mb-12 group"
        >
          <div className="p-2.5 rounded-full bg-secondary/50 group-hover:bg-primary/10 transition-colors border border-border/50">
            <ArrowLeft className={cn("w-5 h-5 transition-transform", locale === "ar" ? "scale-x-[-1] group-hover:translate-x-1" : "group-hover:-translate-x-1")} />
          </div>
          <span className="font-medium text-lg">{t("back_to_certificates")}</span>
        </Link>

        <ImagePreviewer
          images={certificate.imageLink}
          title={certificate.title}
          className="relative w-full max-w-4xl mx-auto aspect-4/3 rounded-2xl md:rounded-3xl shadow-2xl border border-white/10 mb-12 md:mb-16 ring-1 ring-white/10 bg-secondary/5 hover:ring-primary/50 transition-all overflow-hidden"
        />

        <div className="max-w-3xl mx-auto space-y-8 md:space-y-10">
          <div className="bg-card/50 backdrop-blur-md border border-border/50 rounded-2xl md:rounded-3xl p-8 md:p-10 shadow-xl">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-primary/10 rounded-full">
                <Award className="w-12 h-12 text-primary" />
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight text-center mb-6 bg-clip-text text-transparent bg-linear-to-b from-foreground to-foreground/70">
              {certificate.title}
            </h1>

            <div className="flex items-center justify-center gap-2 text-muted-foreground mb-4">
              <span className="text-sm font-medium uppercase tracking-wider">{t("instructor")}:</span>
              <span className="text-base font-semibold text-foreground">{certificate.desc}</span>
            </div>

            <div className="flex items-center justify-center gap-2 text-muted-foreground mb-8">
              <span className="text-sm font-medium uppercase tracking-wider">{t("completed")}:</span>
              <span className="text-base font-semibold text-foreground">
                {(certificate.completedAt || certificate.createdAt)?.toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>

            <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
              {locale === "ar"
                ? `شهادة مهنية في ${certificate.title} تم إكمالها بنجاح. تؤكد هذه الشهادة الكفاءة في المجال المذكور وتُعرض كجزء من رحلة التطوير المهني المستمر.`
                : `Professional certificate in ${certificate.title} successfully completed. This certificate validates competency in the field and is displayed as part of an ongoing professional development journey.`}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
              {certificate.courseLink && (
                <Button
                  asChild
                  size="lg"
                  className="rounded-full text-md h-12 px-8 shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-1"
                >
                  <a href={certificate.courseLink} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-5 h-5 me-2.5" /> {t("view_course")}
                  </a>
                </Button>
              )}
              {certificate.profLink && certificate.profLink.trim() !== '' && (
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-full text-md h-12 px-8 backdrop-blur-sm border-white/10 hover:bg-secondary/10 transition-all hover:-translate-y-1"
                >
                  <a href={certificate.profLink} target="_blank" rel="noopener noreferrer">
                    <Award className="w-5 h-5 me-2.5" /> {t("view_certificate")}
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-32 pt-12 border-t border-border/20 text-center pb-8">
          <Link
            href={`/${locale}/certificates`}
            className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium tracking-widest uppercase hover:underline underline-offset-4"
          >
            {t("back_to_certificates")}
          </Link>
        </div>
      </div>
    </article>
  );
}
