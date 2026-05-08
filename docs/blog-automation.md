# Blog Automation Pipeline

Automatically fetches AI/fullstack/mobile dev news, rewrites as original blog posts via an AI agent, and saves to the portfolio at ahmedlotfy.site.

## How It Works

```
RSS Feeds (14 sources)
    │
    ▼
┌─────────────────────────┐
│  fetch-news.ts          │  runs `bun run fetch:news`
│  - Fetches 12 RSS feeds │
│  - Deduplicates by URL  │
│  - Filters last 24h     │
│  - Skips existing slugs │
│  - Outputs JSON         │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  AI Agent (Hermes cron) │  runs daily at 8:00 AM
│  - Reads JSON           │
│  - Selects 2-3 articles │
│  - Generates blog posts │
│    with proper frontmatter
│  - Saves .md files      │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  ingest-blogs.ts        │  runs `bun run ingest:blogs`
│  - Scans content/blogs/ │
│  - Parses frontmatter   │
│  - Upserts to PostgreSQL│
│    via Drizzle ORM      │
└────────┬────────────────┘
         │
         ▼
    ahmedlotfy.site
    (sitemap auto-updates)
```

## Testing the Pipeline

### Quick test (fetch news only):
```bash
cd /mnt/hdd/projects/my-portfolio
bun run fetch:news
```
This downloads latest articles from all 14 sources, deduplicates, and saves to `.hermes/news-cache/latest-news.json`

### Full pipeline test (manual):
To simulate what the cron job does at 8 AM, run the cron job manually:
```bash
hermes cron run 38a4dd81438c
```
Or trigger via the Hermes Workspace UI (http://localhost:3000 → Cron Jobs → Run).

The cron agent will:
1. Run `bun run fetch:news`
2. Read the JSON
3. Generate 2-3 blog posts in `src/content/blogs/<slug>.md`
4. Run `bun run ingest:blogs`

### Verify the output:

**Blog files created:**
```bash
ls -la src/content/blogs/
```

**Content quality** — each file has YAML frontmatter (title, date, tags, image, share) and body:
```bash
head -15 src/content/blogs/<new-post>.md
```

**Ingested into database:**
```bash
# Via Drizzle Studio
bun run studio

# Or direct SQL
psql "$DATABASE_URL" -c "SELECT title_en, slug, created_at FROM posts ORDER BY created_at DESC LIMIT 5;"
```

**On the live site:**
Visit https://ahmedlotfy.site/en/blogs — new posts appear with correct date, tags, and content.

## RSS Sources (12 feeds)

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

## Cron Job Details

- **Schedule**: Daily at 8:00 AM (`0 8 * * *`)
- **Workdir**: `/mnt/hdd/projects/my-portfolio`
- **Auto-deliver**: Local (logged, no notification)
- **Max posts per run**: 3
- **Stale news cutoff**: 24 hours

## Adding New Sources

Edit `RSS_FEEDS` array in `src/scripts/fetch-news.ts`:
```typescript
{ url: "https://example.com/feed.xml", source: "My Source", category: "ai" },
```

Categories currently used: `ai`, `tech`, `frontend`, `fullstack`, `mobile`, `devops`

## File Structure

```
src/scripts/fetch-news.ts     # News aggregation from RSS
src/scripts/ingest-blogs.ts   # .md → PostgreSQL upsert
src/content/blogs/             # Generated .md files
.hermes/news-cache/            # Latest news JSON cache
```

## Cron Job Management

```bash
# List jobs
hermes cron list

# Run manually (immediate)
hermes cron run 38a4dd81438c

# Pause daily automation
hermes cron pause 38a4dd81438c

# Resume
hermes cron resume 38a4dd81438c

# Remove cron job
hermes cron remove 38a4dd81438c
```
