import { db } from "../db";
import { posts } from "../db/schema";

async function checkDb() {
  const allPosts = await db.query.posts.findMany();
  console.log("--- Current DB Posts ---");
  allPosts.forEach(p => {
    console.log(`[${p.id}] Slug: ${p.slug} | Title: ${p.title_en} | Published: ${p.published} | Source: ${p.source}`);
  });
  console.log("------------------------");
  process.exit(0);
}

checkDb();
