import { getSingleCertificate } from "@/src/app/actions/certificatesActions";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { cn } from "@/src/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Award } from "lucide-react";
import ImageViewer from "@/src/components/ui/ImageViewer";
import { Button } from "@/src/components/ui/button";
import StructuredData from "@/src/components/seo/StructuredData";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { certificate } = await getSingleCertificate(slug);

  if (!certificate) {
    return {
      title: "Certificate Not Found",
    };
  }

  return {
    title: `${certificate.title} | Ahmed Lotfy`,
    description: `Certificate: ${certificate.title} - ${certificate.desc}`,
    openGraph: {
      title: certificate.title,
      description: `Certificate: ${certificate.title} - ${certificate.desc}`,
      images: [certificate.imageLink],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: certificate.title,
      description: `Certificate: ${certificate.title} - ${certificate.desc}`,
      images: [certificate.imageLink],
    },
  };
}

export default async function CertificatePage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const { slug } = params;
  const { certificate } = await getSingleCertificate(slug);
  const locale = await getLocale();
  const t = await getTranslations("certificates");

  if (!certificate) {
    return notFound();
  }

  return (
    <article className="min-h-screen pb-20 bg-background text-foreground selection:bg-primary/20">
      {/* Structured Data for SEO */}
      <StructuredData
        type="EducationalOccupationalCredential"
        data={{
          name: certificate.title,
          description: certificate.desc,
          image: certificate.imageLink,
          url: `https://ahmedlotfy.site/${locale}/certificates/${slug}`,
          credentialCategory: 'Certificate',
          recognizedBy: certificate.desc,
          dateCreated: certificate.createdAt?.toISOString(),
        }}
      />

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 blur-[100px] rounded-full mix-blend-screen opacity-50" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 blur-[100px] rounded-full mix-blend-screen opacity-50" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 pt-24 md:pt-32">
        {/* Back Link */}
        <Link
          href="/#certificates"
          className="inline-flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors mb-8 md:mb-12 group"
        >
          <div className="p-2.5 rounded-full bg-secondary/50 group-hover:bg-primary/10 transition-colors border border-border/50">
            <ArrowLeft className={cn("w-5 h-5 transition-transform", locale === "ar" ? "scale-x-[-1] group-hover:translate-x-1" : "group-hover:-translate-x-1")} />
          </div>
          <span className="font-medium text-lg">{t("back_to_certificates")}</span>
        </Link>

        {/* Certificate Image - Large and Zoomable */}
        <ImageViewer
          imageUrl={certificate.imageLink}
          altText={certificate.title}
          className="relative w-full max-w-4xl mx-auto aspect-4/3 rounded-2xl md:rounded-3xl shadow-2xl border border-white/10 mb-12 md:mb-16 ring-1 ring-white/10 bg-secondary/5 hover:ring-primary/50 transition-all overflow-hidden"
        >
          <Image
            src={certificate.imageLink}
            alt={certificate.title}
            fill
            className="object-contain relative z-10 transition-transform duration-700 group-hover:scale-105"
            priority
            sizes="(max-width: 768px) 100vw, 1200px"
          />
        </ImageViewer>

        {/* Certificate Information Card */}
        <div className="max-w-3xl mx-auto space-y-8 md:space-y-10">
          <div className="bg-card/50 backdrop-blur-md border border-border/50 rounded-2xl md:rounded-3xl p-8 md:p-10 shadow-xl">
            {/* Award Icon */}
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-primary/10 rounded-full">
                <Award className="w-12 h-12 text-primary" />
              </div>
            </div>

            {/* Course Title */}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight text-center mb-6 bg-clip-text text-transparent bg-linear-to-b from-foreground to-foreground/70">
              {certificate.title}
            </h1>

            {/* Instructor/Platform */}
            <div className="flex items-center justify-center gap-2 text-muted-foreground mb-8">
              <span className="text-sm font-medium uppercase tracking-wider">{t("instructor")}:</span>
              <span className="text-base font-semibold text-foreground">{certificate.desc}</span>
            </div>

            {/* Completion Date */}
            <div className="flex items-center justify-center gap-2 text-muted-foreground mb-10">
              <span className="text-sm font-medium uppercase tracking-wider">{t("completed")}:</span>
              <span className="text-base font-semibold text-foreground">
                {certificate.createdAt?.toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>

            {/* Action Buttons */}
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

        {/* Bottom Navigation */}
        <div className="mt-32 pt-12 border-t border-border/20 text-center pb-8">
          <Link
            href="/#certificates"
            className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium tracking-widest uppercase hover:underline underline-offset-4"
          >
            {t("back_to_certificates")}
          </Link>
        </div>
      </div>
    </article>
  );
}

