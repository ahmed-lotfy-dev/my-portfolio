import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";
import { Badge } from "@/src/components/ui/badge";
import { Calendar, Clock, Tag, Star, Eye } from "lucide-react";

interface BlogPost {
  title: string;
  date: string;
  tags: string[];
  category: string;
  slug: string;
  readingTime: string;
  image?: string | null;
  featured?: boolean;
  views?: number;
}

interface BlogCardProps {
  post: BlogPost;
  locale: string;
}

export function BlogCard({ post, locale }: BlogCardProps) {
  return (
    <Card
      className={`relative flex h-full flex-col overflow-hidden border border-border/60 bg-card/80 shadow-md backdrop-blur-sm transition-all duration-500 hover:border-primary/20 hover:shadow-2xl ${post.featured ? "ring-1 ring-primary/20 shadow-primary/5" : ""
        }`}
    >
      {post.featured && (
        <div className="absolute top-4 right-4 z-20">
          <div className="rounded-full bg-primary p-1.5 text-primary-foreground shadow-lg transition-transform duration-500 group-hover:scale-110">
            <Star className="h-3 w-3 fill-primary-foreground" />
          </div>
        </div>
      )}
      <Link href={`/${locale}/blogs/${post.slug}`} className="relative block h-48 overflow-hidden bg-linear-to-br from-secondary via-card to-accent">
        <CardHeader className="p-0 h-full flex items-center justify-center">
          {post.image ? (
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              loading="lazy"
            />
          ) : (
            <>
              <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                <div className="absolute inset-0 bg-[radial-gradient(hsl(var(--primary))_1px,transparent_1px)] bg-size-[20px_20px]" />
              </div>
              <div className="z-10 text-center p-6">
                <div className="mb-3 inline-block rounded-2xl bg-card/85 p-3 backdrop-blur-md shadow-sm">
                  <Tag className="w-6 h-6 text-primary" />
                </div>
                <Badge variant="outline" className="text-xs uppercase tracking-widest font-bold">
                  {post.category}
                </Badge>
              </div>
            </>
          )}
        </CardHeader>
      </Link>

      <CardContent className="p-6 grow flex flex-col">
        <CardTitle className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
          <Link href={`/${locale}/blogs/${post.slug}`} className="hover:underline">
            {post.title}
          </Link>
        </CardTitle>

        <div className="mb-6 flex items-center gap-4 text-xs font-medium text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {post.date}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {post.readingTime}
          </span>
          <span className="flex items-center gap-1.5 text-primary/80">
            <Eye className="w-3.5 h-3.5" />
            {post.views || 0}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mt-auto">
          {post.tags.slice(0, 3).map((t) => (
            <Link
              key={t}
              href={`/${locale}/blogs?tag=${encodeURIComponent(t)}`}
              className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-primary transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
            >
              #{t}
            </Link>
          ))}
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button asChild className="w-full group/btn relative overflow-hidden" variant="ghost">
          <Link href={`/${locale}/blogs/${post.slug}`} className="flex items-center justify-between w-full">
            <span className="font-bold">Read Full Post</span>
            <span className="transform group-hover/btn:translate-x-1 transition-transform">→</span>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
