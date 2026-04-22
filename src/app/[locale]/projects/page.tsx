import { getAllProjects } from "@/src/app/actions/projects/queries";
import ProjectsClient from "@/src/components/features/homepage/ProjectsClient";
import StructuredData from "@/src/components/seo/StructuredData";
import { BreadcrumbSchema } from "@/src/components/seo/BreadcrumbSchema";
import { BackButton } from "@/src/components/ui/BackButton";
import { getTranslations, setRequestLocale } from "next-intl/server";
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
  const t = await getTranslations({ locale, namespace: "projects" });
  const baseUrl = "https://ahmedlotfy.site";
  const title = t("title");
  const description =
    locale === "ar"
      ? "استعرض دراسات حالة ومشاريع برمجية منشورة توضح طريقة التنفيذ والتقنيات والنتائج."
      : "Browse published software projects and case studies covering implementation details, technology choices, and outcomes.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/projects`,
      siteName: "Ahmed Shoman Portfolio",
      locale: locale === "ar" ? "ar_EG" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@ahmedlotfy_dev",
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/projects`,
      languages: {
        en: `${baseUrl}/en/projects`,
        ar: `${baseUrl}/ar/projects`,
      },
      xDefault: `${baseUrl}/en/projects`,
    },
  };
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("projects");
  const { allProjects } = await getAllProjects();
  const publishedProjects = (allProjects ?? []).filter((project) => project.published !== false);

  const translations = {
    readmore: t("readmore"),
    showless: t("showless"),
    view_case_study: t("view_case_study"),
    apk: t("apk"),
    live: t("live"),
    repo: t("repo"),
  };

  return (
    <main className="container mx-auto mt-24 max-w-7xl px-4 pb-20 md:mt-32 md:px-6">
      <StructuredData
        type="CollectionPage"
        data={{
          name: "Project Archive - Ahmed Shoman",
          description:
            locale === "ar"
              ? "صفحة تجمع المشاريع المنشورة ودراسات الحالة الخاصة بأحمد شومان."
              : "An archive of Ahmed Shoman's published projects and case studies.",
          url: `https://ahmedlotfy.site/${locale}/projects`,
          numberOfItems: publishedProjects.length,
        }}
      />
      <BreadcrumbSchema
        items={[
          { label: locale === "ar" ? "الرئيسية" : "Home", url: `/${locale}` },
          { label: locale === "ar" ? "المشاريع" : "Projects", url: `/${locale}/projects` },
        ]}
      />

      <BackButton href={`/${locale}`} label={locale === "ar" ? "العودة للرئيسية" : "Back to Home"} locale={locale} />

      <header className="mb-12 text-center md:mb-16">
        <p className="mb-4 inline-flex rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium uppercase tracking-wide text-primary">
          {locale === "ar" ? "دراسات حالة" : "Case Studies"}
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl">
          {locale === "ar" ? "مشاريع مبنية بهدف واضح ونتيجة قابلة للقياس" : "Projects built with clear goals and measurable outcomes"}
        </h1>
        <p className="mx-auto mt-5 max-w-3xl text-lg text-muted-foreground">
          {locale === "ar"
            ? "دي صفحة تجمع المشاريع المنشورة بدل الاعتماد على قسم داخل الصفحة الرئيسية فقط، وده بيدي محركات البحث صفحة واضحة تفهم منها نوع الشغل والخبرة التقنية."
            : "This index gives search engines a dedicated page for your public work instead of relying only on the homepage section, which improves crawl paths and topic clarity."}
        </p>
      </header>

      <ProjectsClient projects={publishedProjects} locale={locale} t={translations} />
    </main>
  );
}
