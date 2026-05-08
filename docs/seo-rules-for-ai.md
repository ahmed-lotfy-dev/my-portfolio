# SEO Rules for AI Agents & Web Builders

> Derived from real Google Search Console failures on `ahmedlotfy.site` (Next.js portfolio).  
> Apply these rules when building, rebuilding, or refactoring ANY website.

---

## 1. Brand Consistency (Critical)

**Problem:** Site title/H1/schema said "Ahmed Shoman" but domain and socials said "Ahmed Lotfy". Google built an identity profile around the wrong name. Brand queries ranked at position 25.

**Rules:**
- The domain name, HTML `<title>`, H1 headings, schema Person/Organization name, and meta description must ALL use the same brand/name
- Do not use pseudonyms, middle names, or inconsistent variations across different pages
- The Open Graph `site_name` and Twitter `creator` handle should match the brand
- Verify: search `site:example.com "Your Name"` — if your own name doesn't appear in the first few results, your brand is wrong

**Checklist for AI agents:**
- [ ] `<title>` matches the brand name
- [ ] `h1` contains the brand name
- [ ] Schema.org `Person.name` matches
- [ ] Schema.org `WebSite.name` matches
- [ ] OpenGraph `site_name` matches
- [ ] Meta `author`, `creator`, `publisher` all match
- [ ] No outdated/alternative names exist anywhere in the codebase

---

## 2. Internal Linking Structure

**Problem:** Homepage had only 4 `<a href>` links. Googlebot couldn't discover deeper pages through navigation. 43 pages were "crawled but not indexed" partly because there were no crawl paths.

**Rules:**
- Every major section on the homepage must have a real `<a href="/page-path">` link to its dedicated page (not just JS `onClick` or anchor scrolls)
- Navigation menus must use `<Link href="/path">` (framework-appropriate) — not just `/#hash` section links for content that has dedicated pages
- Anchor links (`/#section`) are fine for content that ONLY exists as a single-page section. If there's a dedicated page (e.g., `/projects`), link to the page
- Footer links should point to actual pages, not anchor sections
- The homepage is your strongest page — it should link outward to every important section
- Minimum: each "content pillar" (projects, blog, about, contact) should have at least one static HTML link from the homepage

**Checklist for AI agents:**
- [ ] Homepage has `<a href>` links to `projects`, `blog`, `certificates` (or equivalent)
- [ ] Nav uses page URLs for items that have pages (`/projects`, `/blog`, `/certificates`)
- [ ] Footer uses page URLs not anchor sections
- [ ] Each major section on homepage has a "View all" / "See more" link to the full page
- [ ] Count internal links on homepage — if less than 10, something is wrong

---

## 3. Crawl Budget Management

**Problem:** Googlebot was crawling `.woff2` font files, JSON files, XML files, and Cloudflare email-protection URLs. These wasted crawl budget that should go to real pages. 52 non-content URLs were being crawled.

**Rules:**
- `robots.txt` must explicitly `Disallow` all directories that don't contain indexable content:
  - `/_next/static/` — build assets, fonts, JS bundles
  - `/cdn-cgi/` — Cloudflare internal routes (email protection, etc.)
  - `/api/` — API routes (no indexable content)
  - `/dashboard/` — private/admin pages
  - File type patterns: `/*.woff2$`, `/*.json$`, `/*.xml$` (unless those are content pages)
- Keep `Allow: /` for the content areas
- Add `Crawl-delay: 1` for politeness
- Block known bad bots (AhrefsBot, SemrushBot, MJ12bot, Bytespider, DotBot)
- AI crawlers (GPTBot, Claude-Web, CCBot) should get same treatment as Googlebot — allow content, block static junk

**Checklist for AI agents:**
- [ ] `robots.txt` blocks `/_next/static/`, `/cdn-cgi/`, `/api/`, `/dashboard/`
- [ ] `robots.txt` blocks font/JSON/XML file patterns
- [ ] No important content pages are accidentally blocked
- [ ] Sitemap is referenced in robots.txt
- [ ] Remove `ai-sitemap.json` from sitemaps list (Google can't read JSON sitemaps)
- [ ] Block bad crawlers (AhrefsBot, SemrushBot, MJ12bot, Bytespider)

---

## 4. Sitemap Hygiene

**Problem:** The sitemap included:
- Non-HTML resources: `ai-sitemap.json`, `feed.xml`, `opensearch.xml` (these are not web pages)
- Thin-content pages: certificate detail pages with UUIDs (no unique content worth indexing)
- 72 URLs total, of which ~25 were wasted entries

**Rules:**
- Only include indexable HTML pages in the sitemap
- Exclude:
  - Thin/skeleton pages (certificate details with just a name and date)
  - Non-HTML resources (JSON, XML, RSS feeds)
  - API endpoints
  - Redirect pages
  - Admin/dashboard pages
- Every page in the sitemap should have unique, substantial content
- Use priority correctly:
  - 1.0: Homepage
  - 0.9: Main listing pages (blogs, projects)
  - 0.8: Individual content pages (blog posts, project pages)
  - 0.5: Supporting pages (certificates listing)
  - 0.2: Legal pages (privacy, terms)
- After removing pages from the sitemap, also add `<meta name="robots" content="noindex">` to those pages if they still exist

**Checklist for AI agents:**
- [ ] Sitemap only contains HTML pages
- [ ] No JSON, XML, or feed URLs in sitemap
- [ ] No thin-content pages (UUID detail pages, etc.)
- [ ] No 404/redirect URLs in sitemap
- [ ] Priority values reflect actual page importance
- [ ] Sitemap has proper `lastmod` dates
- [ ] hreflang alternates are correct

---

## 5. Thin Content Detection

**Problem:** Certificate detail pages with UUID URLs had almost no content (just a name, issuer, date). 18 such pages (en + ar) were in the sitemap. Google flagged all as "crawled but not indexed."

**Rules:**
- Any page with less than ~300 words of meaningful content should be `noindex` or excluded from the sitemap
- UUID-based URLs are a red flag — they often indicate auto-generated thin pages
- If a page can be replaced by a listing page (e.g., certificates listing with all data shown), just use the listing page
- Add structured data (schema.org) to content pages to help Google understand what the page is about
- For pages that exist but are intentionally sparse, add `<meta name="robots" content="noindex, follow">`

**Checklist for AI agents:**
- [ ] Every page in sitemap has ≥ ~300 words of unique content
- [ ] No UUID-based URLs for content pages
- [ ] Thin pages use `noindex` meta tag
- [ ] Listing pages have enough content to stand alone

---

## 6. Page Architecture: Single-Page Sections vs Dedicated Pages

For a portfolio/website, the best structure is:

| Content | Homepage Section? | Dedicated Page? | Link Type |
|---------|------------------|-----------------|-----------|
| Hero/Intro | Yes | No (homepage only) | — |
| Projects | Summary/excerpts | Yes (`/projects`) | Link to full page |
| Blog | Recent posts list | Yes (`/blogs`) | Link to full page |
| About | Bio excerpt | Yes (`/about`) | "Full bio" link |
| Testimonials | Carousel/Grid | Optional (`/testimonials`) | Can stay as section |
| Contact | Form + info | Optional (`/contact`) | Can stay as section |
| Certificates | Badges list | Yes (`/certificates`) | Link to full list |

**Rules:**
- Homepage sections should be **excerpts/teasers** that link to full dedicated pages
- Dedicated pages each get their own URL, `<title>`, meta description, and can rank independently
- Each dedicated page creates a new crawl path in the site structure
- Internal links from homepage → dedicated pages pass link equity

**Checklist for AI agents:**
- [ ] Each major content area has a dedicated page with unique metadata
- [ ] Homepage sections link to dedicated pages with `<a href>` tags
- [ ] Dedicated pages have enough content to justify their existence (not just a sentence)

---

## 7. Backlinks & External Validation

**Problem:** Only 12 external links from 5 sites. Near-zero SEO authority.

- This is mostly a marketing problem, not a technical one
- Technical lever: make it easy for others to link to your content
  - Blog posts should have social share buttons
  - Projects should have "Share" functionality
  - Add your site to GitHub profile, LinkedIn, dev.to bio, etc.
- Cross-link from project subdomains to main domain with real `<a>` tags
- Don't put important content on subdomains — Google treats them as separate sites

---

## 8. Technical SEO Quick Checks

- **Canonical URLs**: Every page must have a self-referencing `<link rel="canonical">`
- **Hreflang**: For multilingual sites, every page must link to its alternate language versions
- **Meta descriptions**: Every indexable page needs a unique, descriptive `<meta name="description">`
- **Heading hierarchy**: One `<h1>` per page, followed by `<h2>`, `<h3>`, etc. No skipping levels
- **Schema markup**: Person/Website schema on homepage, Article schema on blog posts
- **Image alt text**: Every `<img>` needs descriptive `alt` attribute
- **www vs non-www**: Pick one and 301 redirect the other
- **SSL/HTTPS**: Ensure all pages serve over HTTPS
- **Core Web Vitals**: Optimize LCP, FID/INP, CLS for good PageSpeed scores

---

## Files Modified During This SEO Fix

For reference, here are all the changes made:

| File | Change |
|------|--------|
| `public/robots.txt` | Blocked static assets, `/cdn-cgi/`, fonts, JSON, XML |
| `src/app/robots.txt/route.ts` | Same + blocked bad bots, AI crawler rules |
| `src/app/sitemap.ts` | Removed certificate detail pages, non-HTML entries, adjusted priorities |
| `src/messages/en.json` | Changed "Ahmed Shoman" → "Ahmed Lotfy", added "blog" footer link |
| `src/messages/ar.json` | Changed Arabic name, fixed footer links |
| `src/data/seo-keywords.json` | Updated brand keywords |
| `src/app/manifest.ts` | Updated PWA manifest name |
| `src/app/[locale]/page.tsx` | Updated metadata, schema, keywords |
| `src/app/[locale]/layout.tsx` | Updated Arabic site name |
| `src/app/[locale]/projects/page.tsx` | Updated Arabic description |
| `src/app/[locale]/projects/[slug]/page.tsx` | Updated author references |
| `src/app/[locale]/blogs/**/page.tsx` | Updated author references |
| `src/app/[locale]/certificates/**/page.tsx` | Updated name references |
| `src/app/[locale]/privacy/page.tsx` | Updated site references |
| `src/app/[locale]/terms/page.tsx` | Updated site references |
| `src/app/feed.xml/route.ts` | Updated RSS feed branding |
| `src/app/ai-sitemap.json/route.ts` | Updated AI sitemap branding |
| `src/app/opensearch.xml/route.ts` | Updated search engine branding |
| `src/app/.well-known/mcp/server-card.json/route.ts` | Updated MCP branding |
| `src/components/seo/PersonSchema.tsx` | Fixed structured data name |
| `src/components/seo/OrganizationSchema.tsx` | Fixed structured data name |
| `src/components/features/homepage/nav/NavBrand.tsx` | Fixed logo alt text |
| `src/components/features/homepage/nav/config.ts` | Changed section anchors to page links |
| `src/components/features/homepage/nav/MobileNav.tsx` | Updated name references |
| `src/components/features/homepage/Hero.tsx` | Changed "View Work" from `#projects` to `/projects` |
| `src/components/features/homepage/Projects.tsx` | Added "View All Projects" link |
| `src/components/features/homepage/Footer.tsx` | Changed footer links from anchors to pages |
| `src/components/features/homepage/AboutClient.tsx` | Updated name references |
| `src/components/agent/WebMcpProvider.tsx` | Updated brand reference |
| `src/lib/agent-ready/site.ts` | Updated site metadata |
| `src/db/seed.ts` | Updated seed data |
| `src/lib/schemas/__tests__/contactSchema.test.ts` | Updated test data |
| `README.md`, `docs/*.md` | Updated documentation references |
