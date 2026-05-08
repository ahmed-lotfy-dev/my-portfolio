import "dotenv/config";
import { db } from "@/src/db";
import { posts } from "@/src/db/schema";
import { eq, sql } from "drizzle-orm";
import { readFileSync, readdirSync } from "fs";
import { join, parse } from "path";

const CONTENT_DIR = join(import.meta.dirname, "..", "content", "blogs");

function parseFrontmatter(raw: string) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return null;

  const fm: Record<string, any> = {};
  const body = match[2].trim();

  for (const line of match[1].split("\n")) {
    const [key, ...rest] = line.split(":");
    const k = key.trim();
    const v = rest.join(":").trim();

    if (!v || v === "") continue;

    if (k === "tags") {
      // Multi-line array or inline
      const tagMatch = match[1].match(/tags:\n((?:\s+-\s+.*\n?)*)/);
      if (tagMatch) {
        fm.tags = tagMatch[1]
          .split("\n")
          .map((t: string) => t.replace(/^\s*-\s*/, "").trim())
          .filter(Boolean);
      } else {
        fm.tags = [v];
      }
    } else if (k === "share" || k === "featured") {
      fm[k] = v === "true";
    } else if (k === "date" || k === "updated") {
      fm[k] = v;
    } else if (k === "image") {
      fm.image = v.replace(/^"|"$/g, "");
    } else {
      fm[k] = v;
    }
  }

  return { frontmatter: fm, body };
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function calcReadingTime(text: string): string {
  const words = text.split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

function extractCategory(tags: string[]): string[] {
  const categoryKeywords: Record<string, string[]> = {
    backend: ["backend", "database", "laravel", "postgresql", "api", "django"],
    frontend: ["frontend", "react", "nextjs", "css", "tailwind", "ui"],
    devops: ["devops", "docker", "deploy", "vps", "ci", "linux"],
    tools: ["tools", "setup", "guide", "cli"],
    automation: ["automation", "workflow", "obsidian", "pipeline"],
  };

  for (const [cat, keywords] of Object.entries(categoryKeywords)) {
    for (const tag of tags) {
      if (keywords.some((k) => tag.toLowerCase().includes(k))) {
        return [cat];
      }
    }
  }
  return ["uncategorized"];
}

async function ingestBlogs() {
  console.log("📂 Scanning:", CONTENT_DIR);
  const files = readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md"));

  if (files.length === 0) {
    console.log("❌ No markdown files found in content/blogs/");
    process.exit(0);
  }

  let imported = 0;
  let skipped = 0;

  for (const file of files) {
    const raw = readFileSync(join(CONTENT_DIR, file), "utf-8");
    const parsed = parseFrontmatter(raw);

    if (!parsed) {
      console.warn(`⚠️  Skipping ${file}: no valid frontmatter`);
      skipped++;
      continue;
    }

    const { frontmatter, body } = parsed;
    const slug = parse(file).name;

    console.log(`\n📄 ${frontmatter.title || slug}`);

    const existing = await db.query.posts.findFirst({
      where: eq(posts.slug, slug),
    });

    const tags: string[] = frontmatter.tags || [];
    const categories = extractCategory(tags);

    const postData = {
      title_en: frontmatter.title || slug,
      content_en: body || "",
      slug,
      imageLink: frontmatter.image || null,
      published: frontmatter.share !== undefined ? frontmatter.share : true,
      featured: frontmatter.featured || false,
      categories,
      tags,
      readingTime: calcReadingTime(body || ""),
      source: "obsidian" as const,
    };

    if (existing) {
      await db.update(posts).set(postData).where(eq(posts.slug, slug));
      console.log(`   ✅ Updated: ${slug}`);
    } else {
      await db.insert(posts).values(postData);
      console.log(`   ✅ Inserted: ${slug}`);
    }
    imported++;
  }

  console.log(`\n🎉 Done! ${imported} imported, ${skipped} skipped.`);
  process.exit(0);
}

ingestBlogs().catch((err) => {
  console.error("❌ Failed:", err);
  process.exit(1);
});
