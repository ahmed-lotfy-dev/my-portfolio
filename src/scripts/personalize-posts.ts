import "dotenv/config";
import { db } from "@/src/db";
import { posts } from "@/src/db/schema";
import { eq, sql } from "drizzle-orm";

const NIM_API = "https://integrate.api.nvidia.com/v1/chat/completions";
const NIM_MODEL = "meta/llama-3.3-70b-instruct";
const API_KEY = process.env.NVIDIA_API_KEY;
const TIMEOUT_MS = 300_000;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 15_000;

const SYSTEM_PROMPT = `You are Ahmed Lotfy — a senior full-stack software engineer based in Egypt. You are going to rewrite a blog post to sound like YOU wrote it from your own experience.

YOUR PROFILE:
- Senior Full-Stack Software Engineer specializing in Next.js, React, TypeScript, Node.js, PostgreSQL
- You build high-performance web and mobile applications
- You're currently based in Egypt and work with clients globally

YOUR TECH STACK (reference naturally):
- Frontend: Next.js, React, TypeScript, TailwindCSS, Framer Motion
- Backend: Node.js, Express, PostgreSQL, Drizzle ORM, Redis
- Mobile: React Native, Expo
- Infrastructure: Docker, Dokploy, VPS hosting, Cloudflare, Cloudflare R2
- Tools: Bun, Git, GitHub Actions, NVIDIA NIM API

YOUR REAL PROJECTS (mention when relevant to the topic):
- selfTracker — React Native mobile app with offline SQLite sync, ElectricSQL
- TaskHub — MCP-driven project management tool with AI agent integration
- POS System — full-stack point-of-sale for local businesses
- The Drive Center — car shipping e-commerce platform
- Zamalek Store — online merchandise store
- Ahmed Lotfy Portfolio — this very Next.js portfolio (ahmedlotfy.site)

WRITING RULES:
- Rewrite in FIRST PERSON — "I've been working with...", "In my projects I...", "Here's what I learned..."
- Add YOUR real experience and opinions where relevant
- NEVER claim you built the featured tool/library itself — the original article is about a third-party tool or trend
- Good: "I integrated this approach into my React Native app and it saved hours of debugging"
- Bad: "I built this framework" (when you didn't)
- Good: "Working with PostgreSQL across multiple projects, I've found this pattern works best"
- Keep all factual information accurate
- Use specific, concrete examples from your own work when possible
- Sound like a real developer talking to other developers — not a marketing blog
- 500-800 words total
- Preserve all markdown formatting
- Keep the YAML frontmatter (title, tags, date, image, etc.) exactly as-is

OUTPUT ONLY the complete markdown file including frontmatter. No explanations, no notes.`;

async function callNim(system: string, user: string): Promise<string | null> {
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
      temperature: 0.7,
      max_tokens: 4096,
    }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`   NIM error ${res.status}: ${text.slice(0, 300)}`);
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
      console.error(`   ${label} attempt ${attempt}/${MAX_RETRIES} failed${isTimeout ? " (timeout)" : ""}.`);
    }
    if (attempt < MAX_RETRIES) {
      await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
    }
  }
  return null;
}

async function main() {
  console.log("━━━ Personalize Blog Posts ━━━\n");

  if (!API_KEY) {
    console.error("NVIDIA_API_KEY is not set.");
    process.exit(1);
  }

  // Get recently published auto-generated posts that haven't been personalized
  const recentPosts = await db.query.posts.findMany({
    where: sql`published = true AND source = 'automation'`,
    columns: { id: true, slug: true, title_en: true, content_en: true },
    orderBy: (posts: any) => [sql`created_at DESC`],
    limit: 3,
  });

  if (recentPosts.length === 0) {
    console.log("No auto-generated posts found to personalize.");
    process.exit(0);
  }

  console.log(`Found ${recentPosts.length} post(s) to personalize:\n`);

  let done = 0;
  for (const post of recentPosts) {
    console.log(`[${done + 1}/${recentPosts.length}] "${post.title_en}"`);
    console.log(`   slug: ${post.slug}`);

    // Skip if content already has first-person markers (already personalized)
    if (post.content_en.includes("I've been") || post.content_en.includes("In my projects")) {
      console.log("   ✓ Already personalized, skipping.\n");
      done++;
      continue;
    }

    const personalized = await withRetry(
      () => callNim(
        SYSTEM_PROMPT,
        `Rewrite this blog post in YOUR voice as Ahmed Lotfy. Make it personal but keep all factual content accurate:\n\n${post.content_en}`
      ),
      "personalization"
    );

    if (!personalized) {
      console.error("   ✗ Personalization failed.\n");
      continue;
    }

    await db
      .update(posts)
      .set({
        content_en: personalized,
        updatedAt: new Date(),
      })
      .where(eq(posts.id, post.id));

    console.log("   ✓ Personalized and saved.\n");
    done++;

    if (done < recentPosts.length) {
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  console.log(`Done. ${done}/${recentPosts.length} posts personalized.`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
