import { getProjectBySlug } from "@/src/app/actions/projectsActions";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { cn } from "@/src/lib/utils";
import Image from "next/image";
import { shouldShowApk } from "@/src/lib/utils/projectUtils";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import ImageViewer from "@/src/components/ui/ImageViewer";
import { Button } from "@/src/components/ui/button";
import StructuredData from "@/src/components/seo/StructuredData";
import { MarkdownDisplay } from "@/src/components/ui/MarkdownDisplay";

// Helper function to extract keywords from markdown content
function extractKeywords(content: string, maxKeywords: number = 15): string[] {
    if (!content) return [];

    // Remove markdown syntax and special characters
    const cleanText = content
        .replace(/[#*`_\[\]()]/g, ' ')
        .replace(/\n+/g, ' ')
        .toLowerCase();

    // Common stop words to filter out
    const stopWords = new Set([
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
        'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
        'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
        'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those',
        'i', 'you', 'he', 'she', 'it', 'we', 'they', 'my', 'your', 'his', 'her',
        'its', 'our', 'their', 'what', 'which', 'who', 'when', 'where', 'why', 'how'
    ]);

    // Extract words and count frequency
    const words = cleanText.split(/\s+/).filter(word =>
        word.length > 3 && !stopWords.has(word) && /^[a-z]+$/.test(word)
    );

    const frequency: Record<string, number> = {};
    words.forEach(word => {
        frequency[word] = (frequency[word] || 0) + 1;
    });

    // Sort by frequency and return top keywords
    return Object.entries(frequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, maxKeywords)
        .map(([word]) => word);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const locale = await getLocale();
    const { project } = await getProjectBySlug(slug);

    if (!project) return { title: "Project Not Found" };

    const title = locale === "ar" ? project.title_ar : project.title_en;
    const description = locale === "ar" ? project.desc_ar : project.desc_en;
    const content = locale === "ar" ? project.content_ar : project.content_en;

    // Extract keywords from content
    const contentKeywords = extractKeywords(content || '', 12);
    const categoryKeywords = project.categories || [];
    const allKeywords = [...new Set([...categoryKeywords, ...contentKeywords])].join(', ');

    return {
        title: `${title} | Ahmed Lotfy`,
        description: description,
        keywords: allKeywords,
        authors: [{ name: 'Ahmed Lotfy' }],
        creator: 'Ahmed Lotfy',
        publisher: 'Ahmed Lotfy',
        openGraph: {
            title: title,
            description: description,
            url: `https://ahmedlotfy.site/${locale}/projects/${slug}`,
            siteName: 'Ahmed Lotfy Portfolio',
            images: [
                {
                    url: project.imageLink,
                    width: 1200,
                    height: 630,
                    alt: title,
                }
            ],
            locale: locale === 'ar' ? 'ar_EG' : 'en_US',
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title: title,
            description: description,
            images: [project.imageLink],
            creator: '@ahmedlotfy_dev',
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
        alternates: {
            canonical: `https://ahmedlotfy.site/${locale}/projects/${slug}`,
            languages: {
                'en': `/en/projects/${slug}`,
                'ar': `/ar/projects/${slug}`,
            },
        },
    };
}

export default async function ProjectDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const { project } = await getProjectBySlug(slug);
    const locale = await getLocale();
    const t = await getTranslations("projects");

    if (!project) {
        return notFound();
    }

    const title = locale === "ar" ? project.title_ar : project.title_en;
    const content = locale === "ar" ? project.content_ar : project.content_en;
    const desc = locale === "ar" ? project.desc_ar : project.desc_en;
    const isMobile = shouldShowApk(project.categories);

    return (
        <article className="min-h-screen pb-20 bg-background text-foreground selection:bg-primary/20">
            {/* Structured Data for SEO */}
            <StructuredData
                type="CreativeWork"
                data={{
                    title: title,
                    description: desc,
                    image: project.imageLink,
                    url: `https://ahmedlotfy.site/${locale}/projects/${slug}`,
                    authorName: 'Ahmed Lotfy',
                    authorUrl: 'https://ahmedlotfy.site',
                    createdDate: project.createdAt?.toISOString(),
                    modifiedDate: project.updatedAt?.toISOString(),
                    keywords: project.categories.join(', '),
                    categories: project.categories,
                    language: locale === 'ar' ? 'ar' : 'en',
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
                    href="/#projects"
                    className="inline-flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors mb-8 md:mb-12 group"
                >
                    <div className="p-2.5 rounded-full bg-secondary/50 group-hover:bg-primary/10 transition-colors border border-border/50">
                        <ArrowLeft className={cn("w-5 h-5 transition-transform", locale === "ar" ? "scale-x-[-1] group-hover:translate-x-1" : "group-hover:-translate-x-1")} />
                    </div>
                    <span className="font-medium text-lg">{t("back_to_portfolio")}</span>
                </Link>

                {/* Hero Image - Immersive & Large */}
                <ImageViewer
                    imageUrl={project.imageLink}
                    altText={title}
                    className={cn(
                        "relative w-full mx-auto shadow-2xl border border-white/10 mb-12 md:mb-16 ring-1 ring-white/10 bg-secondary/5 hover:ring-primary/50 transition-all",
                        isMobile ? "max-w-sm md:max-w-md aspect-9/19 rounded-4xl md:rounded-4xl" : "max-w-5xl aspect-video rounded-2xl md:rounded-4xl"
                    )}
                >
                    {/* Blurred Background Layer */}
                    <Image
                        src={project.imageLink}
                        alt={title}
                        fill
                        className="object-cover blur-2xl opacity-50 scale-110 grayscale-20"
                        priority
                        aria-hidden="true"
                    />

                    {/* Main "Fully Seen" Image */}
                    <Image
                        src={project.imageLink}
                        alt={title}
                        fill
                        className="object-contain relative z-10 transition-transform duration-[1.5s] group-hover:scale-[1.02] drop-shadow-xl"
                        priority
                        sizes="(max-width: 768px) 100vw, 1200px"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-background/20 via-transparent to-transparent pointer-events-none z-20" />
                </ImageViewer>

                {/* Header Content */}
                <div className="max-w-4xl mx-auto space-y-8 md:space-y-12 mb-20 text-start md:text-center">
                    <div className="space-y-6">
                        <div className="flex flex-wrap gap-3 md:justify-center mb-6">
                            {project.categories.map((cat, i) => (
                                <span key={i} className="px-4 py-1.5 bg-secondary/30 backdrop-blur-md border border-white/10 rounded-full text-sm font-medium text-foreground capitalize shadow-sm">
                                    {cat}
                                </span>
                            ))}
                        </div>

                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight bg-clip-text text-transparent bg-linear-to-b from-foreground to-foreground/70">
                            {title}
                        </h1>
                    </div>

                    <p className="text-md md:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                        {desc}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center pt-4">
                        {project.liveLink && (
                            <Button asChild size="lg" className="rounded-full text-md h-12 px-8 shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-1">
                                <a href={project.liveLink} target="_blank">
                                    <ExternalLink className="w-5 h-5 me-2.5" /> {t("visit_live_site")}
                                </a>
                            </Button>
                        )}
                        {project.repoLink && (
                            <Button asChild variant="outline" size="lg" className="rounded-full text-md h-12 px-8 backdrop-blur-sm border-white/10 hover:bg-secondary/10 transition-all hover:-translate-y-1">
                                <a href={project.repoLink} target="_blank">
                                    <Github className="w-5 h-5 me-2.5" /> {t("view_code")}
                                </a>
                            </Button>
                        )}
                    </div>
                </div>

                {/* Markdown Content */}
                <div className="max-w-3xl mx-auto">
                    {content ? (
                        <MarkdownDisplay content={content} />
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 text-center border-y border-dashed border-border/50 bg-card/30 rounded-3xl">
                            <div className="text-4xl mb-4">✍️</div>
                            <p className="text-xl text-muted-foreground font-medium">{t("case_study_coming_soon")}</p>
                        </div>
                    )}
                </div>

                <div className="mt-32 pt-12 border-t border-border/20 text-center pb-8">
                    <Link href="/#projects" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium tracking-widest uppercase hover:underline underline-offset-4">
                        {t("view_other_projects")}
                    </Link>
                </div>
            </div>
        </article>
    );
}
