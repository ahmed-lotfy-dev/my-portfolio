import "dotenv/config";
import { db } from "@/src/db";
import { posts } from "@/src/db/schema";
import { isNull, or, eq } from "drizzle-orm";

const NIM_API = "https://integrate.api.nvidia.com/v1/chat/completions";
const NIM_MODEL = "meta/llama-3.3-70b-instruct";
const API_KEY = process.env.NVIDIA_API_KEY;

const TIMEOUT_MS = 300_000;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 15_000;
const CHUNK_WORD_LIMIT = 400;

const SYSTEM_PROMPT = `You are a native Egyptian Arabic technical writer. Your job is to translate English developer blog posts into Egyptian colloquial Arabic (عامية مصرية).

Rules — read carefully:
1. Write in natural Egyptian colloquial dialect (عامية مصرية), the way a Cairo developer would actually speak, not formal Modern Standard Arabic.
2. NEVER translate technical terms. Keep ALL of the following in English exactly as-is:
   - Programming languages, libraries, frameworks, tools (React, Next.js, TypeScript, Laravel, PostgreSQL, Drizzle ORM, Docker, Bun, Node.js, etc.)
   - API names, endpoints, HTTP verbs (GET, POST, fetch, REST, GraphQL, etc.)
   - File names, paths, extensions (.md, .ts, .env, etc.)
   - Shell commands and code blocks — leave them completely untouched
   - Technical concepts that are industry-standard English terms (slug, frontmatter, pipeline, cron, upsert, deploy, cache, payload, middleware, hook, component, prop, state, etc.)
   - Names of people (authors, creators, developers) — e.g., Tanner Linsley, Dan Abramov, etc. Keep them in English letters (DO NOT transliterate them to Arabic letters).
3. The tone should feel like a smart Egyptian developer explaining things to a friend — casual, clear, and slightly witty. Not corporate, not stiff.
4. Preserve all markdown formatting: headings (##, ###), bold (**), inline code (\`\`), fenced code blocks (\`\`\`), bullet lists, numbered lists, tables, horizontal rules (---).
5. Code blocks must remain 100% unchanged — do not touch a single character inside them.
6. Output ONLY the translated markdown. No preamble, no explanation, nothing before or after.`;

async function nimRequest(
  system: string,
  user: string,
  temperature: number,
  maxTokens: number,
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
    console.error(`   NIM ${res.status}: ${text.slice(0, 200)}`);
    return null;
  }

  const data = await res.json().catch(() => null);
  return data?.choices?.[0]?.message?.content ?? null;
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

async function translateContent(content: string): Promise<string | null> {
  const chunks = splitIntoChunks(content);

  if (chunks.length === 1) {
    return withRetry(
      () => nimRequest(SYSTEM_PROMPT, `Translate this blog post to Egyptian Arabic:\n\n${content}`, 0.4, 4096),
      "content",
    );
  }

  console.log(`   Content is long (${chunks.length} chunks) — translating in parts...`);
  const translated: string[] = [];

  for (let i = 0; i < chunks.length; i++) {
    console.log(`   Chunk ${i + 1}/${chunks.length}...`);
    const result = await withRetry(
      () => nimRequest(
        SYSTEM_PROMPT,
        `Translate this part of a blog post to Egyptian Arabic (part ${i + 1} of ${chunks.length}):\n\n${chunks[i]}`,
        0.4,
        2048,
      ),
      `chunk ${i + 1}`,
    );

    if (!result) {
      console.error(`   Chunk ${i + 1} failed after all retries — aborting post.`);
      return null;
    }
    translated.push(result);

    if (i < chunks.length - 1) {
      await new Promise((r) => setTimeout(r, 3000));
    }
  }

  return translated.join("\n\n");
}

async function translateTitle(title: string): Promise<string | null> {
  return withRetry(
    () => nimRequest(
      `Translate the following blog post title into Egyptian colloquial Arabic (عامية مصرية). Keep ALL technical terms in English. Output ONLY the translated title — no quotes, no explanation.`,
      title,
      0.3,
      128,
    ),
    "title",
  );
}

async function main() {
  console.log("Translate blog posts → Egyptian Arabic\n");

  if (!API_KEY) {
    console.error("NVIDIA_API_KEY is not set. Add it to .env");
    process.exit(1);
  }

  const untranslated = await db.query.posts.findMany({
    where: or(isNull(posts.content_ar), isNull(posts.title_ar)),
    columns: {
      id: true,
      slug: true,
      title_en: true,
      content_en: true,
    },
  });

  if (untranslated.length === 0) {
    console.log("All posts already have Arabic translations.");
    process.exit(0);
  }

  console.log(`Found ${untranslated.length} post(s) missing Arabic content.\n`);

  let done = 0;
  let failed = 0;

  for (const post of untranslated) {
    const idx = done + failed + 1;
    console.log(`[${idx}/${untranslated.length}] "${post.title_en}"`);
    console.log(`   slug: ${post.slug}`);

    const title_ar = await translateTitle(post.title_en);
    if (!title_ar) {
      console.error("   Title translation failed after all retries — skipping.\n");
      failed++;
      continue;
    }
    console.log(`   title_ar: ${title_ar}`);

    const content_ar = await translateContent(post.content_en);
    if (!content_ar) {
      console.error("   Content translation failed after all retries — skipping.\n");
      failed++;
      continue;
    }

    await db
      .update(posts)
      .set({ title_ar, content_ar })
      .where(eq(posts.id, post.id));

    console.log("   Saved.\n");
    done++;

    if (done + failed < untranslated.length) {
      await new Promise((r) => setTimeout(r, 3000));
    }
  }

  console.log(`Finished. ${done} translated, ${failed} failed.`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
