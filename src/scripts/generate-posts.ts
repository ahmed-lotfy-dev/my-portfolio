import "dotenv/config";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { db } from "@/src/db";
import { posts } from "@/src/db/schema";
import { sql } from "drizzle-orm";

interface NewsItem {
  title: string;
  url: string;
  source: string;
  category: string;
  summary: string;
  publishedAt: string;
  slug: string;
}

interface ParsedPost {
  title: string;
  tags: string[];
  description: string;
  body: string;
}

const TIMEOUT_MS = 300_000;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 15_000;
const CHUNK_WORD_LIMIT = 400;

const NEWS_CACHE = "/tmp/news-cache.json";
const MAX_POSTS_PER_RUN = 8;

const NIM_API = "https://integrate.api.nvidia.com/v1/chat/completions";
const NIM_MODEL = "meta/llama-3.3-70b-instruct";
const API_KEY = process.env.NVIDIA_API_KEY;

const CATEGORY_IMAGES: Record<string, string> = {
  ai: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80",
  frontend: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=1200&q=80",
  mobile: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&q=80",
  fullstack: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80",
  tech: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=1200&q=80",
  devops: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=1200&q=80",
};

const SKIP_TITLE_PATTERNS = [
  /\b(stock|investing|investor|billionaire|dividend|ipo|shareholder)\b/i,
  /\b(motley fool|seeking alpha|fool\.com|nasdaq|nyse|wall street)\b/i,
  /\b(buy|sell|rating|upgrade|downgrade)\s+(the\s+)?(stock|shares)\b/i,
  /\b(earnings|revenue|profit|quarterly)\s+(report|call|beat|miss)\b/i,
  /\b(buy|purchase|get)\s+(old|aged|verified)\s+\w+\s+(accounts|profiles)\b/i,
  /\b(cheap|discount|affordable)\s+\w+(\s+\w+)?\s+(accounts|followers|views|likes)\b/i,
  // Gambling / casino
  /\b(bonus|bonuses?|casino|gambling|bet|betting|poker|slot)\b/i,
  /\b(win\s+(real\s+)?money|cash\s+(prize|out)|payout|jackpot|free\s+spins?)\b/i,
  /\b(registration\s+bonus|deposit\s+bonus|no\s+deposit|welcome\s+(bonus|offer))\b/i,
  /\b(crypto\s+(gambling|casino|bet))|(bitcoin\s+(casino|gambling))\b/i,
  /\b(forex|trading\s+(signal|strategy|bot)|signal\s+group)\b/i,
];

const TRANSLATE_SYSTEM = `You are a native Egyptian Arabic technical writer. Translate English developer blog posts into Egyptian colloquial Arabic (عامية مصرية).

Rules:
1. Write in natural Egyptian colloquial dialect — the way a Cairo developer would actually speak, not formal Modern Standard Arabic.
2. NEVER translate technical terms. Keep ALL of the following in English exactly as-is: programming languages, libraries, frameworks, tools (React, Next.js, TypeScript, Laravel, PostgreSQL, etc.), API names, HTTP verbs, file names, paths, shell commands, code blocks, and industry-standard concepts (slug, pipeline, cache, deploy, upsert, hook, component, etc.).
3. NEVER translate names of people (authors, developers, creators, etc.). Keep names like "Tanner Linsley", "Dan Abramov", "Mojo", "React Server Components", etc. in English letters (DO NOT transliterate them to Arabic letters).
4. Tone: smart Egyptian developer explaining things to a friend — casual, clear, slightly witty.
5. Preserve all markdown formatting: headings, bold, inline code, fenced code blocks, bullet lists, tables, horizontal rules.
6. Code blocks must remain 100% unchanged — do not touch a single character inside them.
7. Output ONLY the translated markdown. No preamble, no explanation.`;

// ── Helpers ───────────────────────────────────────────────────────────────

function calcReadingTime(text: string): string {
  const words = text.split(/\s+/).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

function extractCategory(tags: string[]): string[] {
  const map: Record<string, string[]> = {
    backend: ["backend", "database", "laravel", "postgresql", "api", "django"],
    frontend: ["frontend", "react", "nextjs", "css", "tailwind", "ui"],
    devops: ["devops", "docker", "deploy", "vps", "ci", "linux"],
    tools: ["tools", "setup", "guide", "cli"],
    automation: ["automation", "workflow", "pipeline"],
  };
  for (const [cat, keywords] of Object.entries(map)) {
    for (const tag of tags) {
      if (keywords.some((k) => tag.toLowerCase().includes(k))) return [cat];
    }
  }
  return ["uncategorized"];
}

async function getExistingSlugs(): Promise<Set<string>> {
  const rows = await db.query.posts.findMany({ columns: { slug: true } });
  return new Set(rows.map((r) => r.slug));
}

const RELEVANCE_KEYWORDS = [
  "react", "react native", "expo", "nextjs", "typescript", "javascript",
  "tailwind", "node", "api", "graphql", "postgresql", "docker",
  "fullstack", "frontend", "mobile", "web", "app",
  "ai", "machine learning", "llm", "gpt", "openai", "claude",
  "cursor", "copilot", "dev tools", "ide", "vscode",
  "deploy", "ci/cd", "devops", "cloud",
];

function scoreRelevance(item: NewsItem): number {
  const lower = (item.title + " " + item.summary).toLowerCase();
  let score = 0;
  for (const kw of RELEVANCE_KEYWORDS) {
    if (lower.includes(kw)) score += 2;
  }

  const catScores: Record<string, number> = {
    ai: 15, frontend: 10, fullstack: 12, mobile: 10, tech: 5, devops: 3,
  };
  score += catScores[item.category] ?? 0;

  return score;
}

function pickArticles(items: NewsItem[], existing: Set<string>): NewsItem[] {
  const fresh = items.filter((a) => {
    if (existing.has(a.slug)) return false;
    for (const p of SKIP_TITLE_PATTERNS) {
      if (p.test(a.title)) return false;
    }
    return true;
  });

  // Score + deduplicate by topic similarity
  const scored = fresh.map((a) => ({ item: a, score: scoreRelevance(a) }));
  scored.sort((a, b) => b.score - a.score || new Date(b.item.publishedAt).getTime() - new Date(a.item.publishedAt).getTime());

  // Deduplicate: skip articles whose title shares >60% words with a higher-ranked one
  const picked: NewsItem[] = [];
  for (const { item } of scored) {
    const words = new Set(item.title.toLowerCase().split(/\s+/));
    const tooSimilar = picked.some((p) => {
      const pWords = p.title.toLowerCase().split(/\s+/);
      const overlap = [...words].filter((w) => pWords.includes(w)).length;
      return overlap / Math.max(words.size, pWords.size) > 0.6;
    });
    if (!tooSimilar) picked.push(item);
    if (picked.length >= MAX_POSTS_PER_RUN) break;
  }

  return picked;
}

function parseFrontmatterFromMarkdown(md: string): ParsedPost {
  const match = md.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { title: "", tags: [], description: "", body: md.trim() };

  const fm: Record<string, string> = {};
  const rawFm = match[1];
  const body = match[2].trim();

  let tags: string[] = [];
  const tagBlock = rawFm.match(/tags:\n((?:\s+-\s+.*\n?)*)/);
  if (tagBlock) {
    tags = tagBlock[1]
      .split("\n")
      .map((t) => t.replace(/^\s*-\s*/, "").trim())
      .filter(Boolean);
  }

  for (const line of rawFm.split("\n")) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    const val = line.slice(colonIdx + 1).trim().replace(/^"|"$/g, "");
    if (key && val) fm[key] = val;
  }

  return {
    title: fm.title ?? "",
    description: fm.description ?? "",
    tags,
    body,
  };
}

// ── NIM API ───────────────────────────────────────────────────────────────

async function callNim(
  system: string,
  user: string,
  temperature = 0.7,
  maxTokens = 3072,
): Promise<string | null> {
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
    console.error(`   NIM error ${res.status}: ${text.slice(0, 300)}`);
    return null;
  }

  const data = await res.json().catch(() => null);
  if (!data?.choices?.[0]?.message?.content) {
    console.error("   Invalid response shape from NIM API");
    return null;
  }
  return data.choices[0].message.content as string;
}

async function withRetry(
  fn: () => Promise<string | null>,
  label: string,
): Promise<string | null> {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await fn();
      if (result) return result;
    } catch (err: any) {
      const isTimeout = err?.name === "TimeoutError" || err?.name === "AbortError";
      console.error(`   ${label} attempt ${attempt}/${MAX_RETRIES} failed${isTimeout ? " (timeout)" : ""}.`);
    }
    if (attempt < MAX_RETRIES) {
      console.log(`   Waiting ${RETRY_DELAY_MS / 1000}s before retry...`);
      await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
    }
  }
  return null;
}

function splitIntoChunks(text: string): string[] {
  const words = text.split(/\s+/);
  if (words.length <= CHUNK_WORD_LIMIT) return [text];
  const chunks: string[] = [];
  for (let i = 0; i < words.length; i += CHUNK_WORD_LIMIT) {
    chunks.push(words.slice(i, i + CHUNK_WORD_LIMIT).join(" "));
  }
  return chunks;
}

async function translateContent(content: string, system: string): Promise<string | null> {
  const chunks = splitIntoChunks(content);

  if (chunks.length === 1) {
    return withRetry(
      () => callNim(system, `Translate this blog post to Egyptian Arabic:\n\n${content}`, 0.4, 4096),
      "translation",
    );
  }

  console.log(`   Content is long (${chunks.length} chunks) — translating in parts...`);
  const translated: string[] = [];

  for (let i = 0; i < chunks.length; i++) {
    console.log(`   Chunk ${i + 1}/${chunks.length}...`);
    const result = await withRetry(
      () => callNim(
        system,
        `Translate this part of a blog post to Egyptian Arabic (part ${i + 1} of ${chunks.length}):\n\n${chunks[i]}`,
        0.4,
        2048,
      ),
      `chunk ${i + 1}`,
    );
    if (!result) return null;
    translated.push(result);
    if (i < chunks.length - 1) await new Promise((r) => setTimeout(r, 3000));
  }

  return translated.join("\n\n");
}

// ── Main ──────────────────────────────────────────────────────────────────

async function main() {
  console.log("Generating blog posts via NVIDIA NIM\n");

  if (!API_KEY) {
    console.error("NVIDIA_API_KEY is not set. Add it to .env");
    process.exit(1);
  }

  if (!existsSync(NEWS_CACHE)) {
    console.error("No news cache found. Run 'bun run fetch:news' first.");
    process.exit(1);
  }

  const news: NewsItem[] = JSON.parse(readFileSync(NEWS_CACHE, "utf-8"));
  if (news.length === 0) {
    console.log("No news articles in cache.");
    process.exit(0);
  }

  const existing = await getExistingSlugs();
  const articles = pickArticles(news, existing);

  if (articles.length === 0) {
    console.log("All articles in the cache already have blog posts.");
    process.exit(0);
  }

  console.log(`Picked ${articles.length} article(s) for generation\n`);

  let done = 0;

  for (const article of articles) {
    console.log(`[${done + 1}/${articles.length}] "${article.title}"`);
    console.log(`   ${article.source} · ${article.category} · ${article.slug}`);

    const today = new Date().toISOString().split("T")[0];
    const img = CATEGORY_IMAGES[article.category] ?? CATEGORY_IMAGES.fullstack;

    const generateSystem = `You are Ahmed Lotfy — a senior fullstack engineer (React, Next.js, TypeScript, Node.js) and React Native / Expo mobile developer. You write technical blog posts for your portfolio ahmedlotfy.site. Your readers are other devs who want practical, actionable insights.

OUTPUT FORMAT — output ONLY the complete markdown below, nothing before or after:
---
title: "🔥 Your Compelling Title"
date: ${today}
tags:
  - tag1
  - tag2
  - tag3
  - tag4
image: "${img}"
share: true
featured: false
description: "An SEO-optimized 2-3 sentence description of what this post covers."
---

## Introduction
(2-3 paragraphs setting context and hooking the reader)

## Main Body
(insights, analysis, practical takeaways with ## section headings)

## Conclusion
(wrap up with actionable advice and a forward-looking statement)

Requirements:
- 500-800 words — concise, no fluff
- ORIGINAL writing — paraphrase and extend, never copy the source
- Tone: senior dev sharing practical war stories and insights with other devs
- Include at least one code snippet, CLI command, or config example if relevant
- 4-6 relevant lowercase hyphenated tags (e.g. react, typescript, ai, fullstack, react-native, expo)
- Can use one emoji prefix in title (🔥 🚀 ⚡ 🏗️ 🎯 💡 🧠)
- Use the exact image URL above, do not change it
- Do NOT wrap the output in code blocks — output raw markdown only
- NEVER write about gambling, casinos, bonuses, betting, or money games`;

    const generateUser = `Write a blog post based on this news article:

Title: ${article.title}
Source: ${article.source}
Category: ${article.category}
Summary: ${article.summary}`;

    console.log("   [1/2] Generating English content...");
    let rawMd = await withRetry(
      () => callNim(generateSystem, generateUser, 0.7, 3072),
      "generation",
    );

    if (!rawMd) {
      console.error("   Generation failed — skipping.");
      continue;
    }

    if (!rawMd.startsWith("---")) {
      console.log("   Response missing frontmatter — wrapping...");
      const fallbackTags = [article.category, "web-development", "programming"];
      rawMd = `---
title: "${article.title}"
date: ${today}
tags:
  - ${fallbackTags.join("\n  - ")}
image: "${img}"
share: true
featured: false
description: "A deep dive into ${article.title.toLowerCase()}."
---

${rawMd}`;
    } else {
      rawMd = rawMd.replace(/^image:.*$/m, `image: "${img}"`);
    }

    const { title, tags, description, body } = parseFrontmatterFromMarkdown(rawMd);
    const categories = extractCategory(tags);
    const readingTime = calcReadingTime(body);

    console.log("   [2/2] Translating to Egyptian Arabic...");
    const content_ar = await translateContent(body, TRANSLATE_SYSTEM);

    const title_ar = await withRetry(
      () => callNim(
        `You are a native Egyptian Arabic writer. Keep technical terms in English. Output only the translated title.`,
        `Translate this blog post title into Egyptian colloquial Arabic (عامية مصرية). Keep ALL technical terms in English. Output ONLY the translated title — no quotes, no explanation.\n\n${title}`,
        0.3,
        128,
      ),
      "title translation",
    );

    if (!content_ar || !title_ar) {
      console.log("   Translation failed after retries — inserting English-only, run translate:posts later.");
    }

    await db
      .insert(posts)
      .values({
        slug: article.slug,
        title_en: title || article.title,
        content_en: body,
        title_ar: title_ar?.trim() ?? null,
        content_ar: content_ar ?? null,
        imageLink: img,
        published: true,
        featured: false,
        categories,
        tags,
        readingTime,
        source: "automation",
        originalLink: article.url,
      })
      .onConflictDoUpdate({
        target: posts.slug,
        set: {
          title_en: sql`excluded.title_en`,
          content_en: sql`excluded.content_en`,
          title_ar: sql`excluded.title_ar`,
          content_ar: sql`excluded.content_ar`,
          imageLink: sql`excluded.image_link`,
          tags: sql`excluded.tags`,
          categories: sql`excluded.categories`,
          readingTime: sql`excluded.reading_time`,
          updatedAt: new Date(),
        },
      });

    console.log(`   Saved to DB — EN + ${content_ar ? "AR" : "AR missing"}\n`);
    done++;

    if (done < articles.length) {
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  console.log(`Done. ${done}/${articles.length} posts published to DB.`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
