# Blog Automation Pipeline

Automated pipeline that fetches AI/fullstack/mobile dev news, generates original blog posts via NVIDIA NIM API, and publishes to ahmedlotfy.site.

## Architecture

```
RSS Feeds (14 sources)
    │
    ▼
┌──────────────────────────────┐
│  fetch-news.ts                │  bun run fetch:news
│  - Fetches 14 RSS feeds      │
│  - Deduplicates by URL       │
│  - Filters last 24h          │
│  - Skips existing slugs      │
│  - Outputs JSON cache        │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  generate-posts.ts            │  bun run generate:posts
│  - Reads news cache (JSON)   │
│  - Picks 2-3 unblogged       │
│  - Calls NVIDIA NIM API      │
│    (Llama 3.3 70B Instruct)  │
│  - Writes .md files with     │
│    YAML frontmatter          │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  ingest-blogs.ts              │  bun run ingest:blogs
│  - Scans content/blogs/      │
│  - Parses frontmatter        │
│  - Upserts to PostgreSQL     │
│    via Drizzle ORM           │
└────────┬─────────────────────┘
         │
         ▼
    ahmedlotfy.site
    (sitemap auto-updates)
```

## Quick Start

### Single command (full pipeline):
```bash
cd /mnt/hdd/projects/my-portfolio
bun run run:blog
```

This runs all three steps in sequence: fetch → generate → ingest.

### Step by step:
```bash
bun run fetch:news        # Fetch latest articles → .hermes/news-cache/latest-news.json
bun run generate:posts    # Generate blog .md files via NVIDIA NIM → src/content/blogs/
bun run ingest:blogs      # Upsert .md files into PostgreSQL via Drizzle
```

## Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `fetch:news` | `bun run fetch:news` | Fetch RSS feeds, deduplicate, cache to JSON |
| `generate:posts` | `bun run generate:posts` | Read cache, call NVIDIA NIM, write .md files |
| `ingest:blogs` | `bun run ingest:blogs` | Parse .md frontmatter, upsert to PostgreSQL |
| `run:blog` | `bun run run:blog` | Full pipeline (fetch → generate → ingest) |

## Configuration

### Environment Variables (`.env`)
```
NVIDIA_API_KEY=nvapi-...     # Required for generation step
DATABASE_URL=postgresql://... # Required for ingest step (already configured)
```

### News Cache
- Location: `.hermes/news-cache/latest-news.json`
- Contains deduplicated articles from the latest fetch
- Overwritten on each `fetch:news` run

### Blog Output
- Location: `src/content/blogs/<slug>.md`
- Each file has YAML frontmatter (title, date, tags, image, share, featured, description)
- Slug = filename = kebab-case of the article title

## NVIDIA NIM API Details

- **Endpoint**: `https://integrate.api.nvidia.com/v1/chat/completions`
- **Model**: `meta/llama-3.3-70b-instruct` (free tier)
- **Auth**: Bearer token via `NVIDIA_API_KEY` environment variable
- **Parameters**: temperature 0.7, max_tokens 3072, 60s timeout
- **Rate limit**: Generates up to 3 posts per run sequentially

## Production Deployment (Dokploy)

### Setup on Dokploy server:

1. **Add to Environment Variables**
   - `NVIDIA_API_KEY` = your NVIDIA NIM API key

2. **Set up system cron** (SSH into your VPS):
   ```bash
   crontab -e
   ```
   Add:
   ```cron
   0 8 * * * cd /path/to/portfolio && /usr/local/bin/bun run run:blog >> /var/log/blog-automation.log 2>&1
   ```

   Or if using Dokploy's built-in cron:
   - Add a cron task in Dokploy dashboard
   - Command: `cd /app && bun run run:blog`
   - Schedule: `0 8 * * *`

### Manual run on production:
```bash
ssh your-vps
cd /path/to/portfolio
bun run run:blog
```

## RSS Sources (14 feeds)

| Source | URL | Category |
|--------|-----|----------|
| Google News AI | news.google.com/rss/search?q=artificial+intelligence | ai |
| HackerNews | hnrss.org/frontpage?points=50 | tech |
| GitHub Engineering | github.blog/engineering/feed/ | devops |
| Vercel | blog.vercel.com/feed.xml | frontend |
| Google Developers | developers.googleblog.com/feeds/ | fullstack |
| Dev.to AI | dev.to/feed/tag/ai | ai |
| Dev.to React | dev.to/feed/tag/react | frontend |
| Dev.to React Native | dev.to/feed/tag/reactnative | mobile |
| Dev.to Fullstack | dev.to/feed/tag/fullstack | fullstack |
| React Status | react.statuscode.com/rss | frontend |
| Stack Overflow | stackoverflow.blog/feed/ | fullstack |
| React Native Blog | reactnative.dev/blog/feed.xml | mobile |
| Expo Blog | expo.dev/blog/rss.xml | mobile |
| Next.js Blog | nextjs.org/feed.xml | frontend |

## Adding New Sources

Edit `RSS_FEEDS` array in `src/scripts/fetch-news.ts`:
```typescript
{ url: "https://example.com/feed.xml", source: "My Source", category: "ai" },
```

Categories used: `ai`, `tech`, `frontend`, `fullstack`, `mobile`, `devops`

## File Structure

```
src/scripts/fetch-news.ts       # News aggregation from RSS
src/scripts/generate-posts.ts   # Blog generation via NVIDIA NIM
src/scripts/ingest-blogs.ts     # .md → PostgreSQL upsert
src/content/blogs/               # Generated .md files
.hermes/news-cache/              # Latest news JSON cache
docs/blog-automation.md          # This document
```

## Troubleshooting

### "NVIDIA_API_KEY not set"
Add to `.env`: `NVIDIA_API_KEY=nvapi-your-key-here`

### "No news cache found"
Run `bun run fetch:news` first to populate the cache.

### API returns errors
- Check your NVIDIA API key is valid
- The free tier has rate limits — wait a minute between runs
- Verify the model name is correct: `meta/llama-3.3-70b-instruct`

### No articles selected for generation
- All articles in the cache may already have blog posts
- Run `bun run fetch:news` again to get fresh articles
- Check `src/content/blogs/` for existing slugs

### Ingest fails
- Check `DATABASE_URL` is set in `.env`
- Verify the PostgreSQL server is reachable
- The Drizzle schema expects `posts` table — run migrations if needed
