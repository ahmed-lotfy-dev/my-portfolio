import "dotenv/config";
import { syncBlogPosts } from "../app/actions/postsActions";

/**
 * CLI Script for Manual Blog Sync
 * Usage: bun run src/scripts/sync-blog.ts
 */
async function runSync() {
  console.log("🚀 Starting Blog Metadata Sync...");

  try {
    const result = await syncBlogPosts();
    console.log(`✅ Success! Synced ${result.count} posts to the database.`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Sync failed!");
    console.error(error);
    process.exit(1);
  }
}

runSync();
