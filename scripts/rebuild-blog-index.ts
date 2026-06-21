#!/usr/bin/env node
/**
 * Regenerates blog-index.json from markdown frontmatter.
 * Run: bun scripts/rebuild-blog-index.ts
 */
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const BLOG_DIR = path.join(process.cwd(), "src/content/blogs");
const BLOG_DIR_AR = path.join(BLOG_DIR, "ar");
const OUTPUT = path.join(process.cwd(), "src/data/blog-index.json");

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function getMarkdownFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
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

// Collect all posts from both English and Arabic directories
const enFiles = getMarkdownFiles(BLOG_DIR).filter(f => !f.includes('/ar/'));
const arFiles = getMarkdownFiles(BLOG_DIR_AR);

const allFiles = [...enFiles, ...arFiles];

const posts = allFiles
  .map((filePath) => {
    try {
      const content = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(content);
      const stats = readingTime(content);
      const slug = slugify(path.basename(filePath, ".md"));
      const isAr = filePath.includes("/ar/");

      return {
        id: data.id || crypto.randomUUID(),
        title_en: isAr ? (data.title || slug) : (data.title || slug),
        title_ar: isAr ? (data.title || slug) : (data.title || slug),
        slug,
        published: data.published !== false,
        categories: data.tags || [],
        reading_time: stats.text,
        source: data.source || "obsidian",
        featured: data.featured === true,
        views: data.views || 0,
        created_at: data.date || new Date().toISOString(),
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`⚠ Skipping ${path.basename(filePath)}: ${msg}`);
      return null;
    }
  })
  .filter((p): p is NonNullable<typeof p> => p !== null)
  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

fs.writeFileSync(OUTPUT, JSON.stringify(posts, null, 2));
console.log(`✓ Generated blog-index.json with ${posts.length} posts`);
