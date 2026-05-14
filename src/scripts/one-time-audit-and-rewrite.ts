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

const EVAL_SYSTEM = `You are a content quality auditor for a senior full-stack developer portfolio blog. Evaluate blog posts and REJECT or ACCEPT them.

ACCEPT if the post is:
- Tutorial, guide, or how-to about software engineering, web/mobile dev, dev tools, architecture, or programming
- The author's OWN project, workflow, or developer experience
- Technical analysis, comparison, or commentary on dev tools, frameworks, languages, or approaches
- Dev news WITH original analysis and developer perspective (e.g., discussing a new framework release, a language update, a tool launch — as long as it adds original commentary, not just a summary)
- Code-level insights, debugging stories, architecture decisions, setup guides, best practices

REJECT only if the post is:
- News with ZERO original insight — just copy-pasted from another source
- Legal, medical, financial, or stock content
- Vape/drugs/products/dropshipping
- Gambling/casino/betting
- Phone/laptop repair
- Affiliate marketing or "earn money online"
- SEO spam
- Foreign language (not English)
- Political or current events reporting unrelated to tech

IMPORTANT: Dev news and analysis is ACCEPTABLE when it includes original commentary, developer perspective, or technical insight. The author is a senior developer analyzing industry trends — that's exactly what this blog is for.

OUTPUT: REJECT: <reason> or ACCEPT. Be fair.`;

const REPAIR_SYSTEM = `You are Ahmed Lotfy — a senior full-stack software engineer in Egypt AND a skilled tech writer who knows how to craft compelling blog posts. You are given a blog post that was rejected because it doesn't fit. Your job: REWRITE it so it DOES fit and has great hooks.

RULES:
- The post must end up being about software engineering, web/mobile dev, dev tools, architecture, or programming
- If the original is about a non-dev topic (finance, legal, news), REFRAME it from a developer's perspective
  Example: "Apple stock price" -> "What Apple's market cap tells us about developer platform economics"
- Remove any promotional, affiliate, or product-review content
- Add YOUR developer perspective: "From my experience...", "In my full-stack projects..."
- Keep the core useful information, just reframe the topic
- Write in FIRST PERSON
- Reference your tech stack (Next.js, React, TypeScript, Node.js, PostgreSQL, Docker)
- 500-800 words
- Preserve markdown formatting but UPDATE the YAML frontmatter title and description

TITLE CRAFTING (very important):
- Write a compelling, click-worthy title that hooks the reader
- Use numbers, questions, or bold claims when appropriate
- Include SEO keywords naturally
- Examples: "Why I Ditched X for Y in Production", "How I Cut Build Times by 60%", "The Hidden Gotcha in Next.js 16"

HOOK (opening paragraph):
- Start with a compelling question, surprising stat, or strong opinion
- Make the reader want to continue in 2-3 sentences
- Set up the problem before revealing the solution

STRUCTURE:
1. Hook - grab attention
2. Context - why this matters
3. Main content - technical meat (3-5 H2 sections)
4. Practical application - code snippets, configs
5. Conclusion - key takeaways + what's next

If the post genuinely cannot be reframed, return exactly: CANNOT_FIX

Output ONLY the complete rewritten markdown with frontmatter.`;

const PERSONALIZE_SYSTEM = `You are Ahmed Lotfy — a senior full-stack software engineer in Egypt AND a skilled tech writer who crafts compelling dev blog posts. Rewrite this blog post to sound like YOU wrote it, with great hooks and structure.

YOUR TECH STACK: Next.js, React, TypeScript, TailwindCSS, Node.js, PostgreSQL, Drizzle ORM, Redis, React Native, Expo, Docker, Dokploy, Cloudflare, Bun
YOUR PROJECTS (mention when relevant): selfTracker (React Native + SQLite sync), TaskHub (MCP management), POS System, The Drive Center, Zamalek Store, ahmedlotfy.site

RULES:
- Write in FIRST PERSON — "I've been working with...", "In my projects...", "Here's what I learned..."
- NEVER claim you built the featured tool/library itself
- 500-800 words
- Preserve markdown formatting but IMPROVE the YAML frontmatter title and description

TITLE CRAFTING:
- Write a compelling, click-worthy title
- Use numbers, questions, or bold claims when appropriate
- Include SEO keywords naturally
- Examples: "Why I Ditched X for Y", "How I Cut Build Times by 60%", "The Hidden Gotcha in Next.js 16"

HOOK (opening paragraph):
- Start with a compelling question, surprising stat, or strong opinion
- 2-3 sentences that make the reader want to continue

STRUCTURE:
1. Hook - grab attention
2. Context - why this matters
3. Main content - technical meat (3-5 H2 sections)
4. Practical application - code snippets, configs
5. Conclusion - key takeaways + what's next

Output ONLY the complete markdown with frontmatter. No explanations.`;

async function callNim(system: string, user: string, maxTokens = 1024, temperature = 0.3) {
  const res = await fetch(NIM_API, {
    method: "POST",
    headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: NIM_MODEL, messages: [{ role: "system", content: system }, { role: "user", content: user }], temperature, max_tokens: maxTokens }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (res.status === 429) {
    console.error(`   RATE LIMITED (429) — waiting 30s...`);
    await new Promise(r => setTimeout(r, 30000));
    return null; // retry will pick this up
  }
  if (!res.ok) { console.error(`NIM ${res.status}: ${(await res.text()).slice(0, 200)}`); return null; }
  const d = await res.json().catch(() => null);
  return d?.choices?.[0]?.message?.content ?? null;
}

async function withRetry(fn: () => Promise<string | null>, label: string) {
  for (let a = 1; a <= MAX_RETRIES; a++) { try { const r = await fn(); if (r) return r; } catch {} if (a < MAX_RETRIES) await new Promise(r => setTimeout(r, RETRY_DELAY_MS)); }
  return null;
}

async function main() {
  console.log("ONE-TIME BLOG AUDIT + REWRITE\n");
  if (!API_KEY) { console.error("Missing NVIDIA_API_KEY"); process.exit(1); }

  const allPosts = await db.query.posts.findMany({
    columns: { id: true, slug: true, title_en: true, content_en: true },
    where: sql`published = true`,
    orderBy: (p: any) => [sql`created_at ASC`],
  });
  console.log(`Total: ${allPosts.length}\n`);

  console.log("Phase 1: Evaluating...\n");
  const accepted: typeof allPosts = [];
  const rejected: { post: typeof allPosts[0]; reason: string }[] = [];
  const failed: typeof allPosts = [];

  for (let i = 0; i < allPosts.length; i++) {
    const p = allPosts[i];
    process.stdout.write(`[${i + 1}/${allPosts.length}] ${p.title_en?.slice(0, 70)}... `);
    const r = await withRetry(() => callNim(EVAL_SYSTEM, `Title: ${p.title_en}\nContent:\n${(p.content_en || "").slice(0, 2000)}`, 200, 0.3), "eval");
    if (!r) { failed.push(p); console.log("FAILED (will retry later)"); }
    else if (r.startsWith("REJECT")) { rejected.push({ post: p, reason: r.replace("REJECT:", "").trim() }); console.log(`REJECT: ${r}`); }
    else { accepted.push(p); console.log("ACCEPT"); }
    await new Promise(r => setTimeout(r, 12000));
  }

  // Retry failed evaluations indefintely
  while (failed.length > 0) {
    console.log(`\nRetrying ${failed.length} failed evaluation(s)...\n`);
    const stillFailed: typeof allPosts = [];
    for (const p of failed) {
      process.stdout.write(`Retry: ${p.title_en?.slice(0, 70)}... `);
      const r = await withRetry(() => callNim(EVAL_SYSTEM, `Title: ${p.title_en}\nContent:\n${(p.content_en || "").slice(0, 2000)}`, 200, 0.3), "eval");
      if (!r) { stillFailed.push(p); console.log("FAILED (will retry again)"); }
      else if (r.startsWith("REJECT")) { rejected.push({ post: p, reason: r.replace("REJECT:", "").trim() }); console.log(`REJECT: ${r}`); }
      else { accepted.push(p); console.log("ACCEPT"); }
      await new Promise(r => setTimeout(r, 12000));
    }
    failed.length = 0;
    failed.push(...stillFailed);
    if (stillFailed.length > 0) {
      console.log(`\n${stillFailed.length} still failing — waiting 60s then retrying...`);
      await new Promise(r => setTimeout(r, 60000));
    }
  }

  console.log(`\nAccepted: ${accepted.length}, Rejected: ${rejected.length}`);

  // Phase 1.5: Try to repair rejected posts
  let repaired = 0;
  if (rejected.length > 0) {
    console.log(`\nAttempting to repair ${rejected.length} rejected post(s)...\n`);
    for (const r of rejected) {
      process.stdout.write(`Repairing "${r.post.title_en?.slice(0, 60)}..." `);
      const fixed = await withRetry(() => callNim(REPAIR_SYSTEM, `Rewrite this to fit the blog:\n\nTitle: ${r.post.title_en}\n\nContent:\n${(r.post.content_en || "").slice(0, 4000)}`, 4096, 0.7), "repair");
      if (!fixed || fixed.trim() === "CANNOT_FIX") {
        console.log(`CANNOT_FIX — unpublishing`);
        await db.update(posts).set({ published: false, updatedAt: new Date() }).where(eq(posts.id, r.post.id));
      } else {
        const body = fixed.replace(/^---[\s\S]*?---\n*/m, "").trim();
        if (!body) { console.log("no body — unpublishing"); await db.update(posts).set({ published: false, updatedAt: new Date() }).where(eq(posts.id, r.post.id)); continue; }
        // Extract new title from frontmatter if present
        const titleMatch = fixed.match(/^---\n[\s\S]*?^title:\s*"(.*?)"/m);
        const newTitle = titleMatch ? titleMatch[1] : r.post.title_en;
        await db.update(posts).set({ content_en: body, title_en: newTitle, updatedAt: new Date() }).where(eq(posts.id, r.post.id));
        console.log(`REPAIRED — "${newTitle}"`);
        repaired++;
        accepted.push(r.post); // now it goes to personalization phase
      }
      await new Promise(r => setTimeout(r, 12000));
    }
    console.log(`\nRepaired: ${repaired}, Still rejected: ${rejected.length - repaired}\n`);
  }

  console.log("Phase 2: Personalizing accepted posts...\n");
  let personalized = 0, skipped = 0;
  for (let i = 0; i < accepted.length; i++) {
    const p = accepted[i];
    const c = p.content_en || "";
    if (c.includes("I've been") || c.includes("In my projects")) { skipped++; process.stdout.write("."); continue; }
    process.stdout.write(`\n[${i + 1}/${accepted.length}] ${p.title_en?.slice(0, 60)}... `);
    const r = await withRetry(() => callNim(PERSONALIZE_SYSTEM, `Rewrite this blog post in MY voice as Ahmed Lotfy. Keep frontmatter EXACTLY as-is:\n\n${c}`, 4096, 0.7), "pers");
    if (!r) { skipped++; console.log("FAIL"); continue; }
    const body = r.replace(/^---[\s\S]*?---\n*/m, "").trim();
    if (!body) { skipped++; console.log("no body"); continue; }
    await db.update(posts).set({ content_en: body, updatedAt: new Date() }).where(eq(posts.id, p.id));
    personalized++;
    console.log("OK");
    await new Promise(r => setTimeout(r, 12000));
  }

  console.log(`\n\nDone. Remaining published: ~${allPosts.length - (rejected.length - repaired)}, Repaired: ${repaired}, Personalized: ${personalized}, Skipped (already good): ${skipped}`);
  process.exit(0);
}
main().catch(e => { console.error("Fatal:", e); process.exit(1); });
