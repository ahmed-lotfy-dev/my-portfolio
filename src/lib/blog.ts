import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const BLOG_DIR = path.join(process.cwd(), "src/content/blogs");
const BLOG_DIR_AR = path.join(BLOG_DIR, "ar");

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

function getMarkdownFiles(dir: string, recursive = false): string[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files: string[] = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (recursive) {
        files = files.concat(getMarkdownFiles(fullPath, true));
      }
      // Skip subdirectories by default (prevents EN from picking up ar/ folder)
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

function getFilesForLocale(locale: string): string[] {
  return getMarkdownFiles(locale === "ar" ? BLOG_DIR_AR : BLOG_DIR);
}

function getPostsForLocale(locale: string): BlogPost[] {
  return getFilesForLocale(locale)
    .map(parsePost)
    .filter((p) => p.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// ── Public API ──

export function getBlogPost(slug: string, locale: string): BlogPostWithContent | null {
  const files = getFilesForLocale(locale);
  const filePath = files.find((f) => slugify(path.basename(f, ".md")) === slug);
  if (!filePath) return null;
  const post = parsePost(filePath);
  if (!post.published) return null;
  return post;
}

export function getAllBlogPosts(locale: string): BlogPost[] {
  return getPostsForLocale(locale);
}

export function getBlogPostsBySlugs(slugs: string[], locale: string): BlogPost[] {
  const posts = getPostsForLocale(locale);
  const slugSet = new Set(slugs);
  return posts.filter((p) => slugSet.has(p.slug)).slice(0, slugs.length);
}

export function getBlogPostsPaginated(
  locale: string,
  page = 1,
  pageSize = 6
): {
  posts: BlogPost[];
  total: number;
  totalPages: number;
  currentPage: number;
} {
  const allPosts = getPostsForLocale(locale);
  const total = allPosts.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const posts = allPosts.slice(start, start + pageSize);

  return { posts, total, totalPages, currentPage: page };
}

export function getBlogTags(locale: string): { tag: string; count: number }[] {
  const posts = getPostsForLocale(locale);
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

export function getFeaturedPosts(locale: string, limit = 3): BlogPost[] {
  return getPostsForLocale(locale).filter((p) => p.featured).slice(0, limit);
}

export function getRelatedPosts(
  slug: string,
  locale: string,
  limit = 3
): BlogPost[] {
  const current = getBlogPost(slug, locale);
  if (!current) return [];

  return getPostsForLocale(locale)
    .filter((p) => p.slug !== slug)
    .map((p) => ({
      post: p,
      score: p.tags.filter((t) => current.tags.includes(t)).length,
    }))
    .sort((a, b) => b.score - a.score || new Date(b.post.date).getTime() - new Date(a.post.date).getTime())
    .slice(0, limit)
    .map((p) => p.post);
}
