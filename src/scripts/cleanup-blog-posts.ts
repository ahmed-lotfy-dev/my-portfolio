/**
 * Cleanup script: List all blog posts so you can choose which to keep/delete.
 * Then delete the ones NOT in the keep list.
 *
 * Run on server: bun src/scripts/cleanup-blog-posts.ts
 */
import { db } from "@/src/db";
import { posts } from "@/src/db/schema";
import { desc, inArray } from "drizzle-orm";

const KEEP_TITLES = [
  // Posts to KEEP (partial title match)
  "Frontend Build Tools Are Hitting a Wall",
  "React Server Components vs Qwik",
  "Cut Incident Response Time",
  "Rust Build Problem Fix",
  "Image Privacy & Orientation in Laravel",
  "Zero-Effort Obsidian",
  "Cloudflared Tunnel Full Guide",
  "CVSS 10.0 Is Not a Coincidence",
  "UI UX Pro Max Skill",
  "No-Open-Ports",
  "Connecting to PostgreSQL",
  "Master PostgreSQL Self-Hosting",
];

async function main() {
  console.log("=== Blog Post Cleanup ===\n");

  const allPosts = await db.query.posts.findMany({
    orderBy: [desc(posts.createdAt)],
    columns: { id: true, slug: true, title_en: true, published: true, createdAt: true },
  });

  console.log(`Total posts in DB: ${allPosts.length}\n`);

  const keep: typeof allPosts = [];
  const remove: typeof allPosts = [];

  for (const p of allPosts) {
    const shouldKeep = KEEP_TITLES.some((t) => p.title_en.includes(t));
    if (shouldKeep) {
      keep.push(p);
    } else {
      remove.push(p);
    }
  }

  console.log(`KEEP (${keep.length}):`);
  for (const p of keep) {
    console.log(`  ✓ [${p.slug}] ${p.title_en}`);
  }

  console.log(`\nDELETE (${remove.length}):`);
  for (const p of remove) {
    console.log(`  ✗ [${p.slug}] ${p.title_en}`);
  }

  if (remove.length === 0) {
    console.log("\nNothing to delete!");
    return;
  }

  console.log(`\nDeleting ${remove.length} posts...`);
  const deleteIds = remove.map((p) => p.id);
  await db.delete(posts).where(inArray(posts.id, deleteIds));
  console.log(`✅ Done. Deleted ${remove.length} posts. ${keep.length} posts remaining.`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Error:", err);
    process.exit(1);
  });
