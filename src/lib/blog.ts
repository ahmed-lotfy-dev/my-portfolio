import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const BLOG_DIR = path.join(process.cwd(), "src/content/blogs");
const BLOG_DIR_AR = path.join(BLOG_DIR, "ar");

// Simple in-memory cache with file mtime invalidation
interface CacheEntry<T> {
  data: T;
  mtime: number;
}

// Use separate caches for different data types
const postsCache = new Map<string, CacheEntry<BlogPost[]>>();
const filesCache = new Map<string, CacheEntry<string[]>>();
const postCache = new Map<string, CacheEntry<BlogPostWithContent>>();
const tagsCache = new Map<string, CacheEntry<{ tag: string; count: number }[]>>();
const fileMTimeCache = new Map<string, number>();

function isCacheValid(entry: { mtime: number } | undefined, filePath: string): boolean {
  if (!entry) return false;
  try {
    const stats = fs.statSync(filePath);
    return entry.mtime === stats.mtimeMs;
  } catch {
    return false;
  }
}

function getFileMTime(filePath: string): number {
  const cached = fileMTimeCache.get(filePath);
  if (cached) return cached;
  try {
    const stats = fs.statSync(filePath);
    const mtime = stats.mtimeMs;
    fileMTimeCache.set(filePath, mtime);
    return mtime;
  } catch {
    return Date.now();
  }
}

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
  const cached = postCache.get(filePath);
  if (cached && isCacheValid(cached, filePath)) {
    return cached.data;
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);
  const stats = readingTime(content);

  const post: BlogPostWithContent = {
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
      content
        .replace(/[#*`\[\]\(\)!>|_]/g, "")
        .replace(/(?<=\w)-(?=\w)/g, "-") // Keep hyphens between word characters
        .replace(/(?<!\w)-|-(?!\w)/g, " ") // Replace hyphens not between words with space
        .slice(0, 180)
        .trim() + "...",
    content,
    readingTime: stats,
  };

  postCache.set(filePath, { data: post, mtime: getFileMTime(filePath) });
  return post;
}

function getFilesForLocale(locale: string): string[] {
  const dir = locale === "ar" ? BLOG_DIR_AR : BLOG_DIR;
  const cacheKey = `files:${locale}`;
  const cached = filesCache.get(cacheKey);
  if (cached && isCacheValid(cached, dir)) {
    return cached.data;
  }
  const files = getMarkdownFiles(dir);
  filesCache.set(cacheKey, { data: files, mtime: getFileMTime(dir) });
  return files;
}

function getPostsForLocale(locale: string): BlogPost[] {
  const cacheKey = `posts:${locale}`;
  const cached = postsCache.get(cacheKey);
  const dir = locale === "ar" ? BLOG_DIR_AR : BLOG_DIR;
  if (cached && isCacheValid(cached, dir)) {
    return cached.data;
  }

  const posts = getFilesForLocale(locale)
    .map(parsePost)
    .filter((p) => p.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  postsCache.set(cacheKey, { data: posts, mtime: getFileMTime(dir) });
  return posts;
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

export function blogPostExistsInLocale(slug: string, locale: string): boolean {
  const files = getFilesForLocale(locale);
  const filePath = files.find((f) => slugify(path.basename(f, ".md")) === slug);
  if (!filePath) return false;
  const post = parsePost(filePath);
  return post.published;
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
  const cacheKey = `tags:${locale}`;
  const cached = tagsCache.get(cacheKey);
  const dir = locale === "ar" ? BLOG_DIR_AR : BLOG_DIR;
  if (cached && isCacheValid(cached, dir)) {
    return cached.data;
  }

  const posts = getPostsForLocale(locale);
  const tagMap: Record<string, number> = {};

  for (const post of posts) {
    for (const tag of post.tags) {
      tagMap[tag] = (tagMap[tag] || 0) + 1;
    }
  }

  const tags = Object.entries(tagMap)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));

  tagsCache.set(cacheKey, { data: tags, mtime: getFileMTime(dir) });
  return tags;
}

export function getFeaturedPosts(locale: string, limit = 3): BlogPost[] {
  return getPostsForLocale(locale).filter((p) => p.featured).slice(0, limit);
}

// Pre-compute title words and tags for all posts to avoid recreating Sets
function getPostMeta(post: BlogPost) {
  return {
    slug: post.slug,
    titleWords: new Set(post.title.toLowerCase().split(/\s+/).filter(w => w.length > 3)),
    tags: new Set(post.tags),
  };
}

// Cache for post meta to avoid recomputing
const postMetaCache = new Map<string, ReturnType<typeof getPostMeta>>();

function getPostMetaCached(post: BlogPost) {
  const cached = postMetaCache.get(post.slug);
  if (cached) return cached;
  const meta = getPostMeta(post);
  postMetaCache.set(post.slug, meta);
  return meta;
}

export function getRelatedPosts(
  slug: string,
  locale: string,
  limit = 3
): BlogPost[] {
  const current = getBlogPost(slug, locale);
  if (!current) return [];

  const currentMeta = getPostMetaCached(current);
  const currentTitleWords = currentMeta.titleWords;
  const currentTags = currentMeta.tags;

  return getPostsForLocale(locale)
    .filter((p) => p.slug !== slug)
    .map((p) => {
      const pMeta = getPostMetaCached(p);
      // Primary score: tag overlap
      const tagScore = [...pMeta.tags].filter((t) => currentMeta.tags.has(t)).length * 3;
      // Secondary score: title word overlap
      const titleOverlap = [...currentMeta.titleWords].filter(w => pMeta.titleWords.has(w)).length;
      // Tertiary: recency bonus (newer posts get slight preference)
      const recencyBonus = 0;
      return { post: p, score: tagScore + titleOverlap + recencyBonus };
    })
    .sort((a, b) => b.score - a.score || new Date(b.post.date).getTime() - new Date(a.post.date).getTime())
    .slice(0, limit)
    .map((p) => p.post);
}
