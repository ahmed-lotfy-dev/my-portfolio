import "dotenv/config";
import { readFileSync, writeFileSync, readdirSync, existsSync } from "fs";
import { join, parse } from "path";

interface NewsItem {
  title: string;
  url: string;
  source: string;
  category: string;
  summary: string;
  publishedAt: string;
  slug: string;
}

const NEWS_CACHE = join(import.meta.dirname, "..", "..", ".hermes", "news-cache", "latest-news.json");
const CONTENT_DIR = join(import.meta.dirname, "..", "content", "blogs");
const MAX_POSTS_PER_RUN = 3;

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

// Articles matching these patterns (case-insensitive) will be skipped
const SKIP_TITLE_PATTERNS = [
  /\b(stock|investing|investor|billionaire|dividend|ipo|shareholder)\b/i,
  /\b(motley fool|seeking alpha|fool\.com|nasdaq|nyse|wall street)\b/i,
  /\b(buy|sell|rating|upgrade|downgrade)\s+(the\s+)?(stock|shares)\b/i,
  /\b(earnings|revenue|profit|quarterly)\s+(report|call|beat|miss)\b/i,
  /\b(buy|purchase|get)\s+(old|aged|verified)\s+\w+\s+(accounts|profiles)\b/i,
  /\b(cheap|discount|affordable)\s+\w+(\s+\w+)?\s+(accounts|followers|views|likes)\b/i,
];

// ── Helpers ───────────────────────────────────────────────────────────────

function getExistingSlugs(): Set<string> {
  if (!existsSync(CONTENT_DIR)) return new Set();
  return new Set(
    readdirSync(CONTENT_DIR)
      .filter((f) => f.endsWith(".md"))
      .map((f) => parse(f).name),
  );
}

function pickArticles(items: NewsItem[], existing: Set<string>): NewsItem[] {
  const priority = ["ai", "frontend", "fullstack", "mobile", "tech", "devops"];
  const fresh = items.filter((a) => {
    // Skip already-blogged articles
    if (existing.has(a.slug)) return false;
    // Skip financial/investment content
    for (const pattern of SKIP_TITLE_PATTERNS) {
      if (pattern.test(a.title)) return false;
    }
    return true;
  });
  fresh.sort((a, b) => {
    const aIdx = priority.indexOf(a.category);
    const bIdx = priority.indexOf(b.category);
    const catDiff = (aIdx === -1 ? 99 : aIdx) - (bIdx === -1 ? 99 : bIdx);
    if (catDiff !== 0) return catDiff;
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });
  return fresh.slice(0, MAX_POSTS_PER_RUN);
}

// ── NIM API ───────────────────────────────────────────────────────────────

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
      max_tokens: 3072,
    }),
    signal: AbortSignal.timeout(120_000),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`   ❌ NIM error ${res.status}: ${text.slice(0, 300)}`);
    return null;
  }

  const data = await res.json().catch(() => null);
  if (!data?.choices?.[0]?.message?.content) {
    console.error("   ❌ Invalid response from NIM API");
    return null;
  }
  return data.choices[0].message.content;
}

// ── Main ──────────────────────────────────────────────────────────────────

async function main() {
  console.log("📡 Generating blog posts via NVIDIA NIM...\n");

  if (!API_KEY) {
    console.error("❌ NVIDIA_API_KEY is not set in environment");
    console.error("   Add to .env: NVIDIA_API_KEY=nvapi-...");
    process.exit(1);
  }

  if (!existsSync(NEWS_CACHE)) {
    console.error("❌ No news cache found at .hermes/news-cache/latest-news.json");
    console.error("   Run 'bun run fetch:news' first.");
    process.exit(1);
  }

  const news: NewsItem[] = JSON.parse(readFileSync(NEWS_CACHE, "utf-8"));
  if (news.length === 0) {
    console.log("📭 No news articles in cache.");
    process.exit(0);
  }

  const existing = getExistingSlugs();
  const articles = pickArticles(news, existing);

  if (articles.length === 0) {
    console.log("✅ All articles in the cache already have blog posts.");
    process.exit(0);
  }

  console.log(`📝 Picked ${articles.length} unblogged article(s) for generation:\n`);

  let generated = 0;
  for (const article of articles) {
    console.log(`📄  "${article.title}"`);
    console.log(`    ${article.source} · ${article.category} · slug: ${article.slug}`);

    const today = new Date().toISOString().split("T")[0];
    const img = CATEGORY_IMAGES[article.category] || CATEGORY_IMAGES.fullstack;

    const systemPrompt = `You are a technical blog writer for ahmedlotfy.site, a fullstack developer portfolio and blog. Write original, SEO-optimized blog posts based on news articles.

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
- 600-1000 words total
- ORIGINAL writing — paraphrase and extend, never copy the source
- Professional but engaging tone, like a senior dev sharing insights
- 4-6 relevant lowercase hyphenated tags (e.g. react, typescript, ai, fullstack)
- Can use one emoji prefix in title (🔥 🚀 ⚡ 🏗️ 🎯 💡 🧠)
- Use the exact image URL above, do not change it
- Do NOT wrap the output in code blocks — output raw markdown only`;

    const userPrompt = `Write a blog post based on this news article:

Title: ${article.title}
Source: ${article.source}
Category: ${article.category}
Summary: ${article.summary}`;

    console.log(`    ⏳ Calling NIM API (${NIM_MODEL})...`);
    let md = await callNim(systemPrompt, userPrompt);

    if (!md) {
      console.log(`    ⏭️  Skipped — API returned empty response`);
      continue;
    }

    // Ensure it has valid frontmatter
    if (!md.startsWith("---")) {
      // The model didn't follow format — try to salvage by wrapping
      console.log("    ⚠️  Response missing frontmatter, wrapping...");
      const tags = [article.category, "web-development", "programming"];
      md = `---
title: "${article.title}"
date: ${today}
tags:
  - ${tags.join("\n  - ")}
image: "${img}"
share: true
featured: false
description: "A deep dive into ${article.title.toLowerCase()}."
---

${md}`;
    } else {
      // Ensure the correct image URL is used (model sometimes hallucinates)
      const imgLine = `image: "${img}"`;
      md = md.replace(/^image:.*$/m, imgLine);
    }

    const filePath = join(CONTENT_DIR, `${article.slug}.md`);
    writeFileSync(filePath, md, "utf-8");
    console.log(`    ✅ Written: ${filePath}`);
    generated++;
  }

  console.log(`\n🎉 Done! ${generated}/${articles.length} posts generated.`);
}

main().catch((err) => {
  console.error("❌ Fatal error:", err);
  process.exit(1);
});
