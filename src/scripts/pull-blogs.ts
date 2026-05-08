import "dotenv/config";
import { db } from "@/src/db";
import { posts } from "@/src/db/schema";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

const CONTENT_DIR = join(import.meta.dirname, "..", "content", "blogs");

const FORCE = process.argv.includes("--force");

function buildFrontmatter(post: typeof posts.$inferSelect): string {
  const date = post.createdAt
    ? post.createdAt.toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0];

  const tags = (post.tags ?? [])
    .map((t) => `  - ${t}`)
    .join("\n");

  const image = post.imageLink ? `"${post.imageLink}"` : `""`;

  return `---
title: "${post.title_en.replace(/"/g, '\\"')}"
date: ${date}
tags:
${tags || "  - general"}
image: ${image}
share: ${post.published}
featured: ${post.featured}
description: ""
---`;
}

async function main() {
  console.log(`Pulling blog posts from DB → ${CONTENT_DIR}`);
  if (FORCE) console.log("--force: existing files will be overwritten\n");

  if (!existsSync(CONTENT_DIR)) {
    mkdirSync(CONTENT_DIR, { recursive: true });
  }

  const allPosts = await db.query.posts.findMany({
    columns: {
      id: true,
      slug: true,
      title_en: true,
      content_en: true,
      imageLink: true,
      published: true,
      featured: true,
      tags: true,
      createdAt: true,
    },
  });

  if (allPosts.length === 0) {
    console.log("No posts found in the database.");
    process.exit(0);
  }

  console.log(`Found ${allPosts.length} post(s).\n`);

  let written = 0;
  let skipped = 0;

  for (const post of allPosts) {
    const filePath = join(CONTENT_DIR, `${post.slug}.md`);

    if (existsSync(filePath) && !FORCE) {
      console.log(`  skip  ${post.slug}.md  (already exists — use --force to overwrite)`);
      skipped++;
      continue;
    }

    const frontmatter = buildFrontmatter(post);
    const body = post.content_en?.trim() ?? "";
    const md = `${frontmatter}\n\n${body}\n`;

    writeFileSync(filePath, md, "utf-8");
    console.log(`  wrote  ${post.slug}.md`);
    written++;
  }

  console.log(`\nDone. ${written} written, ${skipped} skipped.`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
