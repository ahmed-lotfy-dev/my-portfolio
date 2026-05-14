import "dotenv/config";
import { db } from "@/src/db";
import { posts } from "@/src/db/schema";
import { inArray } from "drizzle-orm";

const TOXIC_SLUGS = new Set([
  // Already cleaned in first pass
  "apple-reaches-250-million-settlement-with-iphone-owners-over-ai-claims-the-jerus",
  "best-places-to-buy-authentic-mr-fog-aura-60k-online",

  // Phone repair - not dev content
  "iphone-17-pro-max-repair",

  // French content - does not belong on an English/Arabic dev blog
  "chatbot-gpt-vs-chatbot-traditionnel-de-quoi-votre-entreprise-a-t-elle-r-ellement",

  // News republishing / zero original insight
  "students-receive-10-000-prizes-from-openai-for-innovative-use-of-artificial-inte",
  "openai-floats-idea-of-global-ai-governance-body-with-us-china-bloomberg-com",

  // Affiliate marketing spam
  "why-affiliate-marketers-who-use-ai-earn-10x-more-than-those-who-don-t",

  // SEO spam / keyword-stuffed agency promotion
  "dxb-apps-future-ready-mobile-app-development-dubai-experts",

  // Republishing Bloomberg journalism
  "gtig-ai-threat-tracker-adversaries-leverage-ai-for-vulnerability-exploitation-au",

  // AI-generated keyword stuffing (dubious product)
  "knowshield-ai-knowledge-layer-defense-in-sharepoint-r-a-h-s-i-framework",

  // Not dev content - unrelated to software engineering
  "day-1-learning-course-roadmap-gitlab-linux-basics",
]);

async function main() {
  console.log("━━━ Extended Toxic Post Cleanup ━━━\n");

  // First, find the slugs that actually exist
  const allPosts = await db.query.posts.findMany({
    columns: { id: true, slug: true, title_en: true, published: true },
  });

  const toUnpublish = allPosts.filter(p => TOXIC_SLUGS.has(p.slug));

  if (toUnpublish.length === 0) {
    console.log("No matching posts found (already cleaned).");
    process.exit(0);
  }

  console.log(`Found ${toUnpublish.length} posts to unpublish:\n`);
  for (const p of toUnpublish) {
    const status = p.published ? "PUBLISHED" : "ALREADY UNPUBLISHED";
    console.log(`  [${status}] ${p.title_en}`);
    console.log(`     slug: ${p.slug}\n`);
  }

  const toActuallyUnpublish = toUnpublish.filter(p => p.published);
  if (toActuallyUnpublish.length === 0) {
    console.log("All posts already unpublished. Nothing to do.");
    process.exit(0);
  }

  await db
    .update(posts)
    .set({ published: false, updatedAt: new Date() })
    .where(inArray(posts.id, toActuallyUnpublish.map(p => p.id)));

  console.log(`✅ Unpublished ${toActuallyUnpublish.length} additional toxic posts.\n`);
  console.log(`Remaining published posts: ${allPosts.filter(p => p.published).length - toActuallyUnpublish.length}`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
