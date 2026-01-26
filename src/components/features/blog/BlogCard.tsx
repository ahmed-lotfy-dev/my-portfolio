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
import { Calendar, Clock, Tag, Star } from "lucide-react";

interface BlogPost {
  title: string;
  date: string;
  tags: string[];
  category: string;
  slug: string;
  readingTime: string;
  image?: string | null;
  featured?: boolean;
}

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Card
      className={`group flex flex-col h-full overflow-hidden border-none shadow-md hover:shadow-2xl transition-all duration-500 bg-white dark:bg-gray-900/50 backdrop-blur-sm relative ${post.featured ? "ring-1 ring-amber-500/20 dark:ring-amber-500/10 shadow-amber-500/5" : ""
        }`}
    >
      {post.featured && (
        <div className="absolute top-4 right-4 z-20">
          <div className="bg-amber-500 text-white p-1.5 rounded-full shadow-lg transform group-hover:scale-110 transition-transform duration-500">
            <Star className="w-3 h-3 fill-white" />
          </div>
        </div>
      )}
      <Link href={`/blogs/${post.slug}`} className="block relative overflow-hidden h-48 bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
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
                <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] bg-size-[20px_20px]" />
              </div>
              <div className="z-10 text-center p-6">
                <div className="inline-block p-3 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm mb-3">
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
          <Link href={`/blogs/${post.slug}`} className="hover:underline">
            {post.title}
          </Link>
        </CardTitle>

        <div className="flex items-center gap-4 text-xs text-gray-500 mb-6 font-medium">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {post.date}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {post.readingTime}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mt-auto">
          {post.tags.slice(0, 3).map((t) => (
            <Link
              key={t}
              href={`/blogs?tag=${t}`}
              className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-300"
            >
              #{t}
            </Link>
          ))}
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button asChild className="w-full group/btn relative overflow-hidden" variant="ghost">
          <Link href={`/blogs/${post.slug}`} className="flex items-center justify-between w-full">
            <span className="font-bold">Read Full Post</span>
            <span className="transform group-hover/btn:translate-x-1 transition-transform">→</span>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
