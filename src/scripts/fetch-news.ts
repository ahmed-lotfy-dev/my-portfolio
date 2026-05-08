import "dotenv/config";
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from "fs";
import { join, parse } from "path";
import { XMLParser } from "fast-xml-parser";

// ── Config ────────────────────────────────────────────────────────────────
const RSS_FEEDS: { url: string; source: string; category: string }[] = [
  // AI & ML news
  { url: "https://news.google.com/rss/search?q=artificial+intelligence&hl=en-US&gl=US&ceid=US:en", source: "Google News AI", category: "ai" },
  { url: "https://hnrss.org/frontpage?points=50", source: "HackerNews", category: "tech" },
  { url: "https://github.blog/engineering/feed/", source: "GitHub Engineering", category: "devops" },
  { url: "https://blog.vercel.com/feed.xml", source: "Vercel", category: "frontend" },
  { url: "https://developers.googleblog.com/feeds/posts/default", source: "Google Developers", category: "fullstack" },
  { url: "https://dev.to/feed/tag/ai", source: "Dev.to AI", category: "ai" },
  { url: "https://dev.to/feed/tag/react", source: "Dev.to React", category: "frontend" },
  { url: "https://dev.to/feed/tag/fullstack", source: "Dev.to Fullstack", category: "fullstack" },
  { url: "https://react.statuscode.com/rss", source: "React Status", category: "frontend" },
  { url: "https://stackoverflow.blog/feed/", source: "Stack Overflow", category: "fullstack" },
];

const CONTENT_DIR = join(import.meta.dirname, "..", "content", "blogs");
const OUTPUT_DIR = join(import.meta.dirname, "..", "..", ".hermes", "news-cache");
const OUTPUT_FILE = join(OUTPUT_DIR, "latest-news.json");

// ── Helpers ───────────────────────────────────────────────────────────────

interface NewsItem {
  title: string;
  url: string;
  source: string;
  category: string;
  summary: string;
  publishedAt: string;
  slug: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

function extractText(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

function getExistingSlugs(): Set<string> {
  if (!existsSync(CONTENT_DIR)) return new Set();
  const files = readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md"));
  return new Set(files.map((f) => parse(f).name));
}

function stripUrlParams(url: string): string {
  try {
    const u = new URL(url);
    u.search = "";
    u.hash = "";
    return u.href.replace(/\/$/, "");
  } catch {
    return url;
  }
}

// ── RSS Parsers ───────────────────────────────────────────────────────────

async function fetchFeed(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { "User-Agent": "my-portfolio-blog-bot/1.0" },
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
  return res.text();
}

function parseRSSItems(xml: string, source: string, category: string): NewsItem[] {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    textNodeName: "#text",
    isArray: (name) => ["item", "entry"].includes(name),
  });

  const doc = parser.parse(xml);
  const feed = doc.rss?.channel?.item || doc.feed?.entry || [];
  const items: NewsItem[] = [];

  for (const item of feed.slice(0, 15)) {
    const title = item.title?.__cdata || item.title?.["#text"] || (typeof item.title === "string" ? item.title : "") || "";
    let link = item.link?.["@_href"] || item.link || "";
    if (typeof link === "object" && link["#text"]) link = link["#text"];
    const rawDesc = item.description?.__cdata || item.description?.["#text"] || (typeof item.description === "string" ? item.description : "") || item.summary?.__cdata || item.summary || item.content?.["#text"] || (typeof item.content === "string" ? item.content : "") || "";
    const summary = extractText(rawDesc).slice(0, 500);
    const pubDate = item.pubDate || item.updated || item.published || new Date().toISOString();

    if (!title || !link) continue;

    items.push({
      title: title.trim(),
      url: stripUrlParams(link.trim()),
      source,
      category,
      summary,
      publishedAt: new Date(pubDate).toISOString(),
      slug: slugify(title.trim()),
    });
  }

  return items;
}

// ── Main ──────────────────────────────────────────────────────────────────

async function fetchAllNews(): Promise<NewsItem[]> {
  const existingSlugs = getExistingSlugs();
  const allItems: NewsItem[] = [];
  const seenUrls = new Set<string>();
  const seenTitles = new Set<string>();
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  for (const feed of RSS_FEEDS) {
    try {
      console.log(`📡 Fetching: ${feed.source}...`);
      const xml = await fetchFeed(feed.url);
      const items = parseRSSItems(xml, feed.source, feed.category);

      for (const item of items) {
        // Skip already-existing blog posts
        if (existingSlugs.has(item.slug)) continue;

        // Deduplicate by URL and normalized title
        const titleKey = item.title.toLowerCase().replace(/[^a-z0-9]/g, "");
        if (seenUrls.has(item.url) || seenTitles.has(titleKey)) continue;

        // Only keep recent content (last 24h)
        const itemDate = new Date(item.publishedAt);
        if (itemDate < oneDayAgo) continue;

        seenUrls.add(item.url);
        seenTitles.add(titleKey);
        allItems.push(item);
      }

      console.log(`   → ${items.length} items (${allItems.length} new after dedup)`);
    } catch (err) {
      console.warn(`   ⚠️  Error fetching ${feed.source}:`, (err as Error).message);
    }
  }

  return allItems;
}

async function main() {
  console.log("━━━ AI & Fullstack News Aggregator ━━━");
  console.log(`Existing blog posts: ${getExistingSlugs().size}`);
  console.log(`\nFetching from ${RSS_FEEDS.length} feeds...\n`);

  const news = await fetchAllNews();

  // Sort by published date (newest first)
  news.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  // Ensure output directory exists
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Write output
  writeFileSync(OUTPUT_FILE, JSON.stringify(news, null, 2));

  console.log(`\n━━━ Summary ━━━`);
  console.log(`Total fresh articles: ${news.length}`);
  console.log(`Saved to: ${OUTPUT_FILE}`);
  console.log(`\nCategories:`);
  const cats: Record<string, number> = {};
  for (const item of news) {
    cats[item.category] = (cats[item.category] || 0) + 1;
  }
  for (const [cat, count] of Object.entries(cats)) {
    console.log(`  ${cat}: ${count}`);
  }
}

main().catch((err) => {
  console.error("❌ Fatal:", err);
  process.exit(1);
});
