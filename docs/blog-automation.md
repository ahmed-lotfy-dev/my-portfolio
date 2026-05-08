# Blog Automation Pipeline

> Two-step automated pipeline: fetches AI / fullstack / mobile dev news, then generates an English post + Egyptian Arabic translation and publishes both directly to the PostgreSQL DB — fully hands-off, no intermediate files.

---

## How It Works (Architecture)

```
RSS Feeds (14 sources)
        │
        ▼
┌──────────────────────────────────────────┐
│  fetch-news.ts               fetch:news  │
│                                          │
│  - Fetches 14 RSS feeds                  │
│  - Deduplicates articles by URL          │
│  - Filters to the last 24 h             │
│  - Skips slugs already in DB            │
│  - Writes → .hermes/news-cache/          │
│             latest-news.json            │
└─────────────────┬────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│  generate-posts.ts       generate:posts  │
│                                          │
│  - Reads latest-news.json                │
│  - Picks up to 3 unblogged items         │
│  - Call 1 → generate English post        │
│    (Llama 3.3 70B, temp 0.7)            │
│  - Call 2 → translate to Egyptian Arabic │
│    (Llama 3.3 70B, temp 0.4)            │
│  - Upserts title_en + content_en +       │
│    title_ar + content_ar to PostgreSQL   │
│    via Drizzle onConflictDoUpdate        │
└─────────────────┬────────────────────────┘
                  │
                  ▼
         ahmedlotfy.site
         /en/blog/<slug>  +  /ar/blog/<slug>
         (sitemap regenerates automatically)
```

**Why no `.md` files?** The app reads from the DB, not from disk. Skipping the file step means fewer moving parts, instant publishing, and the Arabic variant is always created in the same run.

---

## Quick Start

**Full pipeline in one shot:**
```bash
bun run run:blog
```

**Step by step:**
```bash
bun run fetch:news       # → .hermes/news-cache/latest-news.json
bun run generate:posts   # → generate EN + AR → upsert to PostgreSQL
```

**For manually written `.md` posts** (e.g. hand-crafted Obsidian notes):
```bash
bun run ingest:blogs     # scan src/content/blogs/ → upsert to PostgreSQL
```

**Pull existing DB posts back to `.md` files** (one-off utility):
```bash
bun run pull:blogs           # skips files that already exist
bun run pull:blogs --force   # overwrites with DB version
```

---

## Available Scripts

| Script | Command | What it does |
|---|---|---|
| `fetch:news` | `bun run fetch:news` | Pull RSS feeds, deduplicate, cache to JSON |
| `generate:posts` | `bun run generate:posts` | Generate EN + translate AR + upsert to DB |
| `run:blog` | `bun run run:blog` | Full automated pipeline — fetch → generate |
| `ingest:blogs` | `bun run ingest:blogs` | Manual `.md` posts → PostgreSQL (hand-written only) |
| `pull:blogs` | `bun run pull:blogs` | DB → `.md` files (one-off export utility) |

---

## Configuration

### Environment Variables (`.env`)

```env
NVIDIA_API_KEY=nvapi-...      # Required — generation + translation
DATABASE_URL=postgresql://... # Required — DB upsert (already configured)
```

### Artifacts & File Locations

| Artifact | Location | Notes |
|---|---|---|
| News cache | `.hermes/news-cache/latest-news.json` | Overwritten on every `fetch:news` run |
| Manual posts | `src/content/blogs/<slug>.md` | For hand-written posts only, use `ingest:blogs` |
| Automation log | `/var/log/blog-automation.log` | Written by cron on the VPS |

---

## NVIDIA NIM API

| Parameter | Generation | Translation |
|---|---|---|
| Endpoint | `https://integrate.api.nvidia.com/v1/chat/completions` | same |
| Model | `meta/llama-3.3-70b-instruct` | same |
| Auth | Bearer — `NVIDIA_API_KEY` | same |
| Temperature | `0.7` | `0.4` (more consistent) |
| Max tokens | `3072` | `4096` (Arabic can be longer) |
| Timeout | `180 s` | `180 s` |
| Posts per run | up to `3`, sequentially | — |

---

## Production Deployment (Dokploy)

### One-time Setup

1. In Dokploy, add the environment variable:
   ```
   NVIDIA_API_KEY=nvapi-your-key-here
   ```

2. SSH into your VPS and set up the cron:
   ```bash
   crontab -e
   ```

### Cron Schedule — Twice Daily

The pipeline runs at **5 AM UTC** and **3 PM UTC** — which is **8 AM Cairo** and **6 PM Cairo**.

- **5 AM UTC (8 AM Cairo)** — catches overnight US West Coast content + European morning posts
- **3 PM UTC (6 PM Cairo)** — catches the US morning news cycle (peak HackerNews / dev.to traffic)

```cron
0 5,15 * * * cd /app && /usr/local/bin/bun run run:blog >> /var/log/blog-automation.log 2>&1
```

**Or** use Dokploy's built-in cron tasks (add two separate entries):

| Task | Command | Schedule |
|---|---|---|
| Morning run | `cd /app && bun run run:blog` | `0 5 * * *` |
| Afternoon run | `cd /app && bun run run:blog` | `0 15 * * *` |

### Manual Production Run
```bash
ssh your-vps
cd /path/to/portfolio
bun run run:blog
```

---

## RSS Sources (14 Feeds)

| Source | URL | Category |
|---|---|---|
| Google News AI | news.google.com/rss/search?q=artificial+intelligence | ai |
| HackerNews | hnrss.org/frontpage?points=50 | tech |
| GitHub Engineering | github.blog/engineering/feed/ | devops |
| Vercel | blog.vercel.com/feed.xml | frontend |
| Google Developers | developers.googleblog.com/feeds/ | fullstack |
| Dev.to — AI | dev.to/feed/tag/ai | ai |
| Dev.to — React | dev.to/feed/tag/react | frontend |
| Dev.to — React Native | dev.to/feed/tag/reactnative | mobile |
| Dev.to — Fullstack | dev.to/feed/tag/fullstack | fullstack |
| React Status | react.statuscode.com/rss | frontend |
| Stack Overflow Blog | stackoverflow.blog/feed/ | fullstack |
| React Native Blog | reactnative.dev/blog/feed.xml | mobile |
| Expo Blog | expo.dev/blog/rss.xml | mobile |
| Next.js Blog | nextjs.org/feed.xml | frontend |

### Adding a New Source

Open `src/scripts/fetch-news.ts` and append to the `RSS_FEEDS` array:
```typescript
{ url: "https://example.com/feed.xml", source: "My Source", category: "ai" },
```

Valid categories: `ai` · `tech` · `frontend` · `fullstack` · `mobile` · `devops`

---

## File Structure

```
src/
  scripts/
    fetch-news.ts        # RSS aggregation & deduplication
    generate-posts.ts    # Generate EN + translate AR + upsert to DB
    ingest-blogs.ts      # Manual .md posts → PostgreSQL (hand-written only)
    pull-blogs.ts        # One-off export: DB → .md files

  content/
    blogs/               # Hand-written .md posts live here (not auto-generated)

.hermes/
  news-cache/
    latest-news.json     # Latest deduplicated news cache

docs/
  blog-automation.md     # You are here
```

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| `NVIDIA_API_KEY not set` | Add `NVIDIA_API_KEY=nvapi-...` to `.env` |
| `No news cache found` | Run `bun run fetch:news` first |
| API returns 4xx/5xx | Check key validity — free tier has rate limits, wait ~1 min |
| No articles selected | All cached articles already exist in DB — re-run `fetch:news` |
| AR translation missing on a post | Run `bun run generate:posts` again — it upserts safely via `onConflictDoUpdate` |
| DB upsert fails | Check `DATABASE_URL` in `.env`, confirm PostgreSQL is reachable |

---

---

# النسخة العربية — بالعامية المصرية

> pipeline أتوماتيكي من خطوتين: بيجيب أحدث أخبار الـ AI والـ fullstack والـ mobile dev، بيولد بوست إنجليزي + ترجمة عامية مصرية وبيرفعهم مباشرة في الـ PostgreSQL — من غير ما تلمس أي ملف.

---

## الفكرة بتشتغل إزاي؟

```
RSS Feeds (14 مصدر)
        │
        ▼
┌──────────────────────────────────────────────┐
│  fetch-news.ts                   fetch:news  │
│                                              │
│  - بيجيب الـ RSS من 14 مصدر                 │
│  - بيشيل التكرار عن طريق الـ URL            │
│  - بيفلتر اللي اتنشر آخر 24 ساعة            │
│  - بيتخطى الـ slugs اللي موجودة في الـ DB   │
│  - بيكتب → .hermes/news-cache/              │
│             latest-news.json                │
└─────────────────┬────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────────┐
│  generate-posts.ts           generate:posts  │
│                                              │
│  - بيقرا الـ latest-news.json                │
│  - بيختار لحد 3 موضوعات مش موجودة في الـ DB │
│  - Call 1 → يولد البوست بالإنجليزي           │
│    (Llama 3.3 70B, temp 0.7)                │
│  - Call 2 → يترجم لعامية مصرية              │
│    (Llama 3.3 70B, temp 0.4)                │
│  - بيعمل upsert لـ title_en + content_en +   │
│    title_ar + content_ar في PostgreSQL       │
│    عن طريق Drizzle onConflictDoUpdate        │
└─────────────────┬────────────────────────────┘
                  │
                  ▼
         ahmedlotfy.site
         /en/blog/<slug>  +  /ar/blog/<slug>
         (الـ sitemap بيتحدث أوتوماتيك)
```

**ليه مفيش ملفات `.md`؟** الـ app بتقرا من الـ DB مش من الـ disk. غيّرنا الطريقة عشان نقلل التعقيد — البوست بيتنشر فورًا والترجمة العربية بتتعمل في نفس الـ run.

---

## ابدأ بسرعة

**شغّل الـ pipeline كله دفعة واحدة:**
```bash
bun run run:blog
```

**أو خطوة خطوة:**
```bash
bun run fetch:news       # → .hermes/news-cache/latest-news.json
bun run generate:posts   # → يولد EN + AR → upsert في PostgreSQL
```

**للبوستات المكتوبة يدويًا** (زي ملاحظات Obsidian):
```bash
bun run ingest:blogs     # يسكان src/content/blogs/ → upsert في PostgreSQL
```

**تصدير البوستات من الـ DB لملفات `.md`** (أداة استخدام مرة واحدة):
```bash
bun run pull:blogs           # بيتخطى الملفات الموجودة
bun run pull:blogs --force   # بيكتب فوق الموجود من الـ DB
```

---

## الـ Scripts المتاحة

| الـ Script | الأمر | بيعمل إيه |
|---|---|---|
| `fetch:news` | `bun run fetch:news` | يسحب الـ RSS feeds، يشيل التكرار، يحفظ JSON |
| `generate:posts` | `bun run generate:posts` | يولد EN + يترجم AR + يعمل upsert في الـ DB |
| `run:blog` | `bun run run:blog` | الـ pipeline كاملة — fetch → generate |
| `ingest:blogs` | `bun run ingest:blogs` | ملفات `.md` مكتوبة يدوي → PostgreSQL |
| `pull:blogs` | `bun run pull:blogs` | الـ DB → ملفات `.md` (تصدير مرة واحدة) |

---

## الإعداد

### متغيرات البيئة (`.env`)

```env
NVIDIA_API_KEY=nvapi-...      # مطلوب — للـ generation والـ translation
DATABASE_URL=postgresql://... # مطلوب — للـ upsert في الـ DB (موجود خلاص)
```

---

## الـ NVIDIA NIM API

| البيانات | الـ Generation | الـ Translation |
|---|---|---|
| الـ Endpoint | `https://integrate.api.nvidia.com/v1/chat/completions` | نفسه |
| الموديل | `meta/llama-3.3-70b-instruct` | نفسه |
| الـ Auth | Bearer — `NVIDIA_API_KEY` | نفسه |
| الـ Temperature | `0.7` | `0.4` (أكثر ثبات للترجمة) |
| Max tokens | `3072` | `4096` (العربي ممكن يطول) |
| الـ Timeout | `180 ثانية` | `180 ثانية` |
| بوستات في كل شغلة | لحد `3`، واحد واحد | — |

---

## الـ Deployment على Production (Dokploy)

### الإعداد مرة واحدة

1. في Dokploy، ضيف الـ environment variable:
   ```
   NVIDIA_API_KEY=nvapi-your-key-here
   ```

2. ادخل على الـ VPS بـ SSH وحط الـ cron:
   ```bash
   crontab -e
   ```

### جدول الـ Cron — مرتين في اليوم

الـ pipeline بيشتغل **5 صبح UTC** و**3 بعد الظهر UTC** — اللي بيساوي **8 صبح Cairo** و**6 بالليل Cairo**.

- **5 صبح UTC (8 صبح Cairo)** — بيمسك الأخبار اللي اتنشرت بالليل في US + الأخبار الأوروبية الصبح
- **3 بعد الظهر UTC (6 بالليل Cairo)** — بيمسك أخبار الصبح الأمريكي (ده وقت peak الـ HackerNews و dev.to)

```cron
0 5,15 * * * cd /app && /usr/local/bin/bun run run:blog >> /var/log/blog-automation.log 2>&1
```

**أو** استخدم الـ cron tasks في Dokploy (إضافتين منفصلتين):

| الـ Task | الأمر | الـ Schedule |
|---|---|---|
| شغلة الصبح | `cd /app && bun run run:blog` | `0 5 * * *` |
| شغلة بعد الظهر | `cd /app && bun run run:blog` | `0 15 * * *` |

### تشغيل يدوي على السيرفر
```bash
ssh your-vps
cd /path/to/portfolio
bun run run:blog
```

---

## مصادر الـ RSS (14 مصدر)

| المصدر | الـ URL | الـ Category |
|---|---|---|
| Google News AI | news.google.com/rss/search?q=artificial+intelligence | ai |
| HackerNews | hnrss.org/frontpage?points=50 | tech |
| GitHub Engineering | github.blog/engineering/feed/ | devops |
| Vercel | blog.vercel.com/feed.xml | frontend |
| Google Developers | developers.googleblog.com/feeds/ | fullstack |
| Dev.to — AI | dev.to/feed/tag/ai | ai |
| Dev.to — React | dev.to/feed/tag/react | frontend |
| Dev.to — React Native | dev.to/feed/tag/reactnative | mobile |
| Dev.to — Fullstack | dev.to/feed/tag/fullstack | fullstack |
| React Status | react.statuscode.com/rss | frontend |
| Stack Overflow Blog | stackoverflow.blog/feed/ | fullstack |
| React Native Blog | reactnative.dev/blog/feed.xml | mobile |
| Expo Blog | expo.dev/blog/rss.xml | mobile |
| Next.js Blog | nextjs.org/feed.xml | frontend |

### عايز تضيف مصدر جديد؟

افتح `src/scripts/fetch-news.ts` وضيف سطر في الـ `RSS_FEEDS` array:
```typescript
{ url: "https://example.com/feed.xml", source: "My Source", category: "ai" },
```

الـ categories المتاحة: `ai` · `tech` · `frontend` · `fullstack` · `mobile` · `devops`

---

## هيكل الملفات

```
src/
  scripts/
    fetch-news.ts        # بيجيب الأخبار من الـ RSS ويشيل التكرار
    generate-posts.ts    # يولد EN + يترجم AR + upsert في الـ DB
    ingest-blogs.ts      # ملفات .md مكتوبة يدوي → PostgreSQL
    pull-blogs.ts        # تصدير: الـ DB → ملفات .md

  content/
    blogs/               # البوستات اليدوية فقط — مش للـ automation

.hermes/
  news-cache/
    latest-news.json     # الـ cache بتاع آخر أخبار

docs/
  blog-automation.md     # انت هنا دلوقتي
```

---

## المشاكل الشائعة وحلولها

| المشكلة | الحل |
|---|---|
| `NVIDIA_API_KEY not set` | ضيف `NVIDIA_API_KEY=nvapi-...` في `.env` |
| `No news cache found` | شغّل `bun run fetch:news` الأول |
| الـ API بيرد بـ 4xx/5xx | تأكد إن الـ key صح — الـ free tier فيه rate limits، استنى دقيقة |
| مفيش مقالات اتاختارت | الـ DB عنده كل الـ slugs دي خلاص — شغّل `fetch:news` تاني |
| بوست مفيهوش ترجمة عربية | شغّل `bun run generate:posts` تاني — الـ upsert آمن ومش هيكرر |
| الـ DB upsert بيفشل | تأكد من `DATABASE_URL` في `.env` وإن PostgreSQL شغال |
