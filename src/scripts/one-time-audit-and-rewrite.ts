import "dotenv/config";
import { db } from "@/src/db";
import { posts } from "@/src/db/schema";
import { inArray, sql, eq } from "drizzle-orm";

const NIM_API = "https://integrate.api.nvidia.com/v1/chat/completions";
const NIM_MODEL = "meta/llama-3.3-70b-instruct";
const API_KEY = process.env.NVIDIA_API_KEY;
const TIMEOUT_MS = 300_000;
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 15_000;

// ── Evaluation System Prompt ──────────────────────────────────────────────

const EVAL_SYSTEM = `You are a strict content quality auditor for a senior full-stack developer portfolio blog. Your job: evaluate blog posts and either REJECT or REWRITE them.

RULES — a post PASSES if it is about software engineering, web/mobile dev, dev tools, architecture, or programming. It must NOT be:
- News republishing (just summarizing a news article with no original insight)
- Legal, medical, financial, or stock content
- Vape/drugs/products/dropshipping
- Gambling/casino/betting
- Phone/laptop repair
- Affiliate marketing or "earn money" content
- SEO spam or keyword stuffing
- Foreign language content (not English)
- Product reviews or "best places to buy" content
- Political or current events reporting

OUTPUT FORMAT — respond with EXACTLY one of these:

If the post FAILS:
REJECT: <brief reason>

If the post PASSES:
ACCEPT

Be strict. A post about "how AI is changing coding" passes. A post about "Apple stock price" rejects. A post that's mostly news summary with minimal dev commentary rejects.`;

// ── Personalization System Prompt ─────────────────────────────────────────

const PERSONALIZE_SYSTEM = `You are Ahmed Lotfy — a senior full-stack software engineer in Egypt. You are going to rewrite a blog post to sound like YOU wrote it from your own experience.

YOUR PROFILE:
- Senior Full-Stack Software Engineer specializing in Next.js, React, TypeScript, Node.js, PostgreSQL
- Based in Egypt, working with clients globally
- Building high-performance web and mobile applications

YOUR TECH STACK:
- Frontend: Next.js, React, TypeScript, TailwindCSS, Framer Motion
- Backend: Node.js, Express, PostgreSQL, Drizzle ORM, Redis
- Mobile: React Native, Expo
- Infrastructure: Docker, Dokploy, VPS hosting, Cloudflare, Cloudflare R2
- Tools: Bun, Git, GitHub Actions, NVIDIA NIM API

YOUR REAL PROJECTS (mention when relevant):
- selfTracker — React Native mobile app with offline SQLite sync, ElectricSQL
- TaskHub — MCP-driven project management with AI agent integration
- POS System — full-stack point-of-sale for local businesses
- The Drive Center — car shipping e-commerce platform
- Zamalek Store — online merchandise store
- This portfolio at ahmedlotfy.site

WRITING RULES:
- Write in FIRST PERSON — "I've been working with...", "In my projects I...", "Here's what I learned..."
- Add YOUR real experience and opinions where relevant
- NEVER claim you built the featured tool/library itself
- Keep all factual information accurate
- 500-800 words
- Preserve all markdown formatting including frontmatter (title, tags, date, image — leave these EXACTLY as-is)
- Sound like a real developer talking to other developers
- Output ONLY the complete markdown with frontmatter. No explanations.`;

// ── NIM API ───────────────────────────────────────────────────────────────

async function callNim(system: string, user: string, maxTokens = 1024, temperature = 0.3): Promise<string | null> {
  const res = await fetch(NIM_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: NIM_MODEL,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature,
      max_tokens: maxTokens,
    }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`   NIM error ${res.status}: ${text.slice(0, 200)}`);
    return null;
  }

  const data = await res.json().catch(() => null);
  return data?.choices?.[0]?.message?.content ?? null;
}

async function withRetry(fn: () => Promise<string | null>, label: string): Promise<string | null> {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await fn();
      if (result) return result;
    } catch (err: any) {
      const isTimeout = err?.name === "TimeoutError" || err?.name === "AbortError";
      console.error(`   ${label} attempt ${attempt}/${MAX_RETRIES} failed${isTimeout ? " (timeout)" : ""}`);
    }
    if (attempt < MAX_RETRIES) {
      await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
    }
  }
  return null;
}

// ── Main ──────────────────────────────────────────────────────────────────

async function main() {
  console.log("╔══════════════════════════════════════════════╗");
  console.log("║  ONE-TIME BLOG AUDIT + REWRITE              ║");
  console.log("╚══════════════════════════════════════════════╝\n");

  if (!API_KEY) {
    console.error("NVIDIA_API_KEY is not set.");
    process.exit(1);
  }

  // Get all published posts
  const allPosts = await db.query.posts.findMany({
    columns: { id: true, slug: true, title_en: true, content_en: true, published: true, source: true },
    where: sql`published = true`,
    orderBy: (posts: any) => [sql`created_at ASC`],
  });

  console.log(`Total published posts: ${allPosts.length}\n`);

  // ── Phase 1: Evaluate ─────────────────────────────────────────────

  console.log("── Phase 1: Evaluating posts against quality gate ──\n");

  const accepted: typeof allPosts = [];
  const rejected: { post: typeof allPosts[0]; reason: string }[] = [];

  for (let i = 0; i < allPosts.length; i++) {
    const post = allPosts[i];
    const label = `[${i + 1}/${allPosts.length}]`;
    console.log(`${label} "${post.title_en?.slice(0, 80)}..."`);
    console.log(`   slug: ${post.slug}`);

    const content = post.content_en?.slice(0, 2000) || "";
    const evalInput = `Title: ${post.title_en}\n\nContent (first 2000 chars):\n${content}`;

    const result = await withRetry(
      () => callNim(EVAL_SYSTEM, evalInput, 200, 0.3),
      "evaluation"
    );

    if (!result) {
      console.log(`   ⚠️  Evaluation failed — treating as ACCEPT (safe default)\n`);
      accepted.push(post);
      continue;
    }

    if (result.startsWith("REJECT")) {
      const reason = result.replace("REJECT:", "").trim();
      rejected.push({ post, reason });
      console.log(`   ❌ REJECT: ${reason}\n`);
    } else {
      accepted.push(post);
      console.log(`   ✅ ACCEPT\n`);
    }

    await new Promise((r) => setTimeout(r, 1000));
  }

  // ── Unpublish rejected ──────────────────────────────────────────

  console.log("── Summary ──");
  console.log(`Accepted: ${accepted.length}`);
  console.log(`Rejected: ${rejected.length}\n`);

  if (rejected.length > 0) {
    console.log("Rejected posts:");
    for (const r of rejected) {
      console.log(`  ❌ "${r.post.title_en}"`);
      console.log(`     reason: ${r.reason}`);
    }
    console.log();

    const rejectIds = rejected.map((r) => r.post.id);
    await db
      .update(posts)
      .set({ published: false, updatedAt: new Date() })
      .where(inArray(posts.id, rejectIds));
    console.log(`✅ Unpublished ${rejected.length} post(s).\n`);
  }

  // ── Phase 2: Personalize accepted ───────────────────────────────

  console.log("── Phase 2: Personalizing accepted posts ──\n");

  let personalized = 0;
  let skipped = 0;

  for (let i = 0; i < accepted.length; i++) {
    const post = accepted[i];
    const label = `[${i + 1}/${accepted.length}]`;

    // Skip if already personalized (has first-person markers)
    const content = post.content_en || "";
    if (content.includes("I've been") || content.includes("In my projects") || content.includes("From my experience")) {
      console.log(`${label} "${post.title_en?.slice(0, 60)}..."`);
      console.log(`   ⏭️  Already personalized, skipping.\n`);
      skipped++;
      continue;
    }

    console.log(`${label} "${post.title_en?.slice(0, 60)}..."`);
    console.log(`   slug: ${post.slug}`);

    const fullContent = post.content_en || "";
    const userPrompt = `Rewrite this blog post in MY voice as Ahmed Lotfy. Keep the YAML frontmatter (title, tags, date, image) EXACTLY as-is:\n\n${fullContent}`;

    const rewritten = await withRetry(
      () => callNim(PERSONALIZE_SYSTEM, userPrompt, 4096, 0.7),
      "personalization"
    );

    if (!rewritten) {
      console.log(`   ⚠️  Failed to personalize — leaving as-is.\n`);
      skipped++;
      continue;
    }

    // Extract: keep frontmatter from original, body from rewrite
    const rewriteBody = rewritten.replace(/^---[\s\S]*?---\n*/m, "").trim();
    if (!rewriteBody) {
      console.log(`   ⚠️  Rewrite had no body — skipping.\n`);
      skipped++;
      continue;
    }

    await db
      .update(posts)
      .set({
        content_en: rewriteBody,
        updatedAt: new Date(),
      })
      .where(eq(posts.id, post.id));

    console.log(`   ✅ Personalized.\n`);
    personalized++;

    await new Promise((r) => setTimeout(r, 2000));
  }

  // ── Final Report ────────────────────────────────────────────────

  console.log("╔══════════════════════════════════════════════╗");
  console.log("║  COMPLETE                                    ║");
  console.log("╚══════════════════════════════════════════════╝");
  console.log(`\nTotal published before: ${allPosts.length}`);
  console.log(`Rejected + unpublished: ${rejected.length}`);
  console.log(`Personalized: ${personalized}`);
  console.log(`Skipped (already good): ${skipped}`);
  console.log(`\nRemaining published: ${allPosts.length - rejected.length}`);
  console.log("\nNext steps:");
  console.log("  1. The sitemap will auto-update (dynamic)");
  console.log("  2. Resubmit sitemap to Google Search Console");
  console.log("  3. Request re-indexing of updated pages");

  process.exit(0);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
