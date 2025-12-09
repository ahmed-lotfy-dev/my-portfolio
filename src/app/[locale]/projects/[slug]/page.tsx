import { getProjectBySlug } from "@/src/app/actions/projectsActions";
import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await getLocale();
  const { project } = await getProjectBySlug(slug);

  if (!project) return { title: "Project Not Found" };

  return {
    title: locale === "ar" ? project.title_ar : project.title_en,
    description: locale === "ar" ? project.desc_ar : project.desc_en,
    openGraph: {
      images: [project.imageLink],
    },
  };
}

export default async function ProjectDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { project } = await getProjectBySlug(slug);
  const locale = await getLocale();

  if (!project) {
    return notFound();
  }

  const title = locale === "ar" ? project.title_ar : project.title_en;
  const content = locale === "ar" ? project.content_ar : project.content_en;
  const desc = locale === "ar" ? project.desc_ar : project.desc_en;

  return (
    <article className="min-h-screen pt-24 pb-16 px-6 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="fixed inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full mix-blend-screen opacity-30" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/20 blur-[120px] rounded-full mix-blend-screen opacity-30" />
        </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 group"
        >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Portfolio</span>
        </Link>
        
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
            <div className="relative w-full md:w-1/3 aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <Image
                    src={project.imageLink}
                    alt={title}
                    fill
                    className="object-cover"
                    priority
                />
            </div>
            <div className="flex-1 space-y-4">
                 <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                    {title}
                 </h1>
                 <p className="text-lg text-muted-foreground leading-relaxed">
                    {desc}
                 </p>
                 <div className="flex flex-wrap gap-2 pt-2">
                    {project.categories.map((cat, i) => (
                        <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-muted-foreground">
                            {cat}
                        </span>
                    ))}
                 </div>
                 <div className="flex gap-4 pt-4">
                    {project.liveLink && (
                        <a 
                            href={project.liveLink} 
                            target="_blank" 
                            className="inline-flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-full font-medium hover:shadow-lg hover:shadow-primary/25 transition-all hover:scale-105"
                        >
                            <ExternalLink size={16} /> Live Demo
                        </a>
                    )}
                    {project.repoLink && (
                        <a 
                            href={project.repoLink} 
                            target="_blank" 
                            className="inline-flex items-center gap-2 px-6 py-2 bg-white/5 text-foreground border border-white/10 rounded-full font-medium hover:bg-white/10 transition-all hover:scale-105"
                        >
                            <Github size={16} /> Source Code
                        </a>
                    )}
                 </div>
            </div>
        </div>

        {/* Content Section */}
        <div className="prose prose-invert prose-lg max-w-none prose-headings:text-foreground prose-a:text-primary prose-img:rounded-xl prose-img:shadow-xl">
             {content ? (
                 <ReactMarkdown>{content}</ReactMarkdown>
             ) : (
                 <div className="text-center py-20 text-muted-foreground bg-white/5 rounded-2xl border border-dashed border-white/10">
                    <p>Detailed case study coming soon.</p>
                 </div>
             )}
        </div>
      </div>
    </article>
  );
}
