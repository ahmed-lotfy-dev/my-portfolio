import { getProjectBySlug } from "@/src/app/actions/projectsActions";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { cn } from "@/src/lib/utils";
import Image from "next/image";
import { shouldShowApk } from "@/src/lib/utils/projectUtils";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import ImageViewer from "@/src/components/ui/ImageViewer";
import { Button } from "@/src/components/ui/button";
import StructuredData from "@/src/components/seo/StructuredData";

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
                    <div className="prose prose-lg md:prose-xl max-w-none 
                    prose-headings:font-bold prose-headings:tracking-tight
                    prose-p:text-muted-foreground prose-p:leading-loose
                    prose-li:marker:text-primary
                    ">
                        {content ? (
                            <ReactMarkdown
                                components={{
                                    img: ({ node, ...props }) => (
                                        <div className="my-10">
                                            <ImageViewer
                                                imageUrl={(props.src as string) || ""}
                                                altText={props.alt || "Project Image"}
                                                className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-secondary/5 hover:ring-2 hover:ring-primary/50 transition-all"
                                            >
                                                <Image
                                                    src={(props.src as string) || ""}
                                                    alt={props.alt || "Project Image"}
                                                    fill
                                                    className="object-cover hover:scale-105 transition-transform duration-700"
                                                />
                                            </ImageViewer>
                                            {props.alt && (
                                                <p className="text-center text-sm text-muted-foreground mt-3 italic">
                                                    {props.alt}
                                                </p>
                                            )}
                                        </div>
                                    ),
                                    h1: ({ children }) => (
                                        <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight mb-10 mt-16 text-foreground">
                                            {children}
                                        </h1>
                                    ),
                                    h2: ({ children }) => (
                                        <div className="group mt-16 mb-6">
                                            <h2 className="font-heading flex items-center text-2xl md:text-3xl font-semibold tracking-tight text-foreground border-b border-border/40 pb-4">
                                                {children}
                                            </h2>
                                        </div>
                                    ),
                                    h3: ({ children }) => (
                                        <h3 className="font-heading text-xl md:text-2xl font-semibold mt-12 mb-4 text-foreground tracking-tight">
                                            {children}
                                        </h3>
                                    ),
                                    p: ({ children }) => (
                                        <p className="leading-8 text-muted-foreground mb-6 text-lg md:text-xl font-normal">
                                            {children}
                                        </p>
                                    ),
                                    strong: ({ children }) => (
                                        <strong className="font-semibold text-primary-foreground bg-primary px-2 py-0.5 rounded-md text-[0.9em] shadow-sm align-middle mx-1">
                                            {children}
                                        </strong>
                                    ),
                                    a: ({ href, children }) => (
                                        <a
                                            href={href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center text-primary font-medium border-b-2 border-primary/20 hover:border-primary transition-all duration-300 hover:bg-primary/5 rounded-sm px-1 gap-1"
                                        >
                                            {children}
                                            <ExternalLink className="w-3.5 h-3.5 opacity-50" />
                                        </a>
                                    ),
                                    blockquote: ({ children }) => (
                                        <blockquote className="relative border-l-4 border-l-primary bg-secondary/30 rounded-r-xl px-8 py-6 my-10 backdrop-blur-sm">
                                            <div className="absolute top-0 right-0 p-3 opacity-10">
                                                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 16.4533 21.5231 17.7913 20.6873 18.8454C19.9868 19.7289 19.0567 20.4468 17.9942 20.8872C16.7323 21.4103 15.3528 21.4554 14.017 21ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 16.4533 12.5227 17.7913 11.6869 18.8454C10.9864 19.7289 10.0563 20.4468 8.99378 20.8872C7.73191 21.4103 6.3524 21.4554 5.0166 21Z" /></svg>
                                            </div>
                                            <div className="text-xl font-medium leading-relaxed text-foreground italic">
                                                {children}
                                            </div>
                                        </blockquote>
                                    ),
                                    ul: ({ children }) => (
                                        <ul className="space-y-4 my-8 list-none pl-2">
                                            {children}
                                        </ul>
                                    ),
                                    li: ({ children }) => (
                                        <li className="flex items-start gap-3 text-muted-foreground text-lg/relaxed group">
                                            <span className="flex-shrink-0 mt-2.5 w-1.5 h-1.5 rounded-full bg-primary" />
                                            <span className="group-hover:text-foreground transition-colors duration-200">
                                                {children}
                                            </span>
                                        </li>
                                    ),
                                    code({ node, className, children, ...props }) {
                                        const match = /language-(\w+)/.exec(className || '');
                                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                        const { ref, ...rest } = props;
                                        return match ? (
                                            <div className="my-8 rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-[#1e1e1e]">
                                                {/* Mac-like Header */}
                                                <div className="flex items-center gap-1.5 px-4 py-3 bg-[#252526] border-b border-white/5">
                                                    <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                                                    <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                                                    <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                                                </div>
                                                <SyntaxHighlighter
                                                    style={vscDarkPlus as any}
                                                    language={match[1]}
                                                    PreTag="div"
                                                    customStyle={{ margin: 0, background: 'transparent', padding: '1.5rem' }}
                                                    {...rest}
                                                >
                                                    {String(children).replace(/\n$/, '')}
                                                </SyntaxHighlighter>
                                            </div>
                                        ) : (
                                            <code className="bg-secondary/50 text-primary px-1.5 py-0.5 rounded-md font-medium text-sm" {...props}>
                                                {children}
                                            </code>
                                        );
                                    },
                                    table: ({ children }) => (
                                        <div className="overflow-x-auto my-8 rounded-xl border border-border/50 shadow-lg">
                                            <table className="w-full text-left text-sm">
                                                {children}
                                            </table>
                                        </div>
                                    ),
                                    thead: ({ children }) => (
                                        <thead className="bg-secondary/30 text-foreground font-semibold">
                                            {children}
                                        </thead>
                                    ),
                                    tr: ({ children }) => (
                                        <tr className="border-b border-border/50 last:border-0 hover:bg-secondary/10 transition-colors">
                                            {children}
                                        </tr>
                                    ),
                                    th: ({ children }) => (
                                        <th className="px-6 py-4 font-semibold text-foreground/90 uppercase tracking-wider text-xs">
                                            {children}
                                        </th>
                                    ),
                                    td: ({ children }) => (
                                        <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                                            {children}
                                        </td>
                                    ),
                                }}
                            >
                                {content}
                            </ReactMarkdown>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-24 text-center border-y border-dashed border-border/50 bg-card/30 rounded-3xl">
                                <div className="text-4xl mb-4">✍️</div>
                                <p className="text-xl text-muted-foreground font-medium">{t("case_study_coming_soon")}</p>
                            </div>
                        )}
                    </div>
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
