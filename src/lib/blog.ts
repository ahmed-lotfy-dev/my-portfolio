import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const BLOG_DIR = path.join(process.cwd(), "src/content/blogs");

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  image: string;
  share: boolean;
  featured: boolean;
  published: boolean;
  excerpt: string;
  readingTime: { text: string; minutes: number; time: number; words: number };
}

export interface BlogPostWithContent extends BlogPost {
  content: string;
}

function getMarkdownFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files: string[] = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(getMarkdownFiles(fullPath));
    } else if (entry.name.endsWith(".md")) {
      files.push(fullPath);
    }
  }
  return files;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function parsePost(filePath: string): BlogPostWithContent {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);
  const stats = readingTime(content);

  return {
    slug: slugify(path.basename(filePath, ".md")),
    title: data.title || path.basename(filePath, ".md"),
    date: data.date || new Date().toISOString(),
    tags: data.tags || [],
    image: data.image || "",
    share: data.share !== false,
    featured: data.featured === true,
    published: data.published !== false,
    excerpt:
      data.excerpt ||
      content.replace(/[#*`\[\]\(\)!>|_\-]/g, "").slice(0, 180).trim() + "...",
    content,
    readingTime: stats,
  };
}

export function getBlogPost(slug: string): BlogPostWithContent | null {
  const files = getMarkdownFiles(BLOG_DIR);
  const filePath = files.find((f) => slugify(path.basename(f, ".md")) === slug);
  if (!filePath) return null;
  const post = parsePost(filePath);
  if (!post.published) return null;
  return post;
}

export function getBlogPostByLocale(slug: string, locale: string): BlogPostWithContent | null {
  const post = getBlogPost(slug);
  if (!post) return null;
  const isAr = slug.endsWith("-ar");
  if (locale === "ar" && !isAr) return null;
  if (locale === "en" && isAr) return null;
  return post;
}

export function getAllBlogPosts(): BlogPost[] {
  const files = getMarkdownFiles(BLOG_DIR);
  return files
    .map(parsePost)
    .filter((p) => p.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getAllBlogPostsByLocale(locale: string): BlogPost[] {
  const all = getAllBlogPosts();
  if (locale === "ar") {
    return all.filter((p) => p.slug.endsWith("-ar"));
  }
  return all.filter((p) => !p.slug.endsWith("-ar"));
}

export function getBlogPostsBySlugs(slugs: string[]): BlogPost[] {
  return slugs
    .map((slug) => getBlogPost(slug))
    .filter((p): p is BlogPostWithContent => p !== null);
}

export function getBlogPostsPaginated(
  page = 1,
  pageSize = 6
): {
  posts: BlogPost[];
  total: number;
  totalPages: number;
  currentPage: number;
} {
  const allPosts = getAllBlogPosts();
  const total = allPosts.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const posts = allPosts.slice(start, start + pageSize);

  return { posts, total, totalPages, currentPage: page };
}

export function getBlogPostsPaginatedByLocale(
  locale: string,
  page = 1,
  pageSize = 6
): {
  posts: BlogPost[];
  total: number;
  totalPages: number;
  currentPage: number;
} {
  const allPosts = getAllBlogPostsByLocale(locale);
  const total = allPosts.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const posts = allPosts.slice(start, start + pageSize);

  return { posts, total, totalPages, currentPage: page };
}

export function getBlogTagsByLocale(locale: string): { tag: string; count: number }[] {
  const posts = getAllBlogPostsByLocale(locale);
  const tagMap: Record<string, number> = {};

  for (const post of posts) {
    for (const tag of post.tags) {
      tagMap[tag] = (tagMap[tag] || 0) + 1;
    }
  }

  return Object.entries(tagMap)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export function getBlogTags(): { tag: string; count: number }[] {
  const posts = getAllBlogPosts();
  const tagMap: Record<string, number> = {};

  for (const post of posts) {
    for (const tag of post.tags) {
      tagMap[tag] = (tagMap[tag] || 0) + 1;
    }
  }

  return Object.entries(tagMap)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export function getFeaturedPosts(limit = 3): BlogPost[] {
  return getAllBlogPosts().filter((p) => p.featured).slice(0, limit);
}

export function getRelatedPosts(
  slug: string,
  limit = 3
): BlogPost[] {
  const current = getBlogPost(slug);
  if (!current) return [];

  return getAllBlogPosts()
    .filter((p) => p.slug !== slug)
    .map((p) => ({
      post: p,
      score: p.tags.filter((t) => current.tags.includes(t)).length,
    }))
    .sort((a, b) => b.score - a.score || new Date(b.post.date).getTime() - new Date(a.post.date).getTime())
    .slice(0, limit)
    .map((p) => p.post);
}

export function getRelatedPostsByLocale(
  slug: string,
  locale: string,
  limit = 3
): BlogPost[] {
  const current = getBlogPost(slug);
  if (!current) return [];

  const localePosts = getAllBlogPostsByLocale(locale)
    .filter((p) => p.slug !== slug);

  if (localePosts.length === 0) {
    return getAllBlogPosts()
      .filter((p) => p.slug !== slug)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  }

  return localePosts
    .map((p) => ({
      post: p,
      score: p.tags.filter((t) => current.tags.includes(t)).length,
    }))
    .sort((a, b) => b.score - a.score || new Date(b.post.date).getTime() - new Date(a.post.date).getTime())
    .slice(0, limit)
    .map((p) => p.post);
}
