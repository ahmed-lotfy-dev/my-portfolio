---

title: Why I Ditched My Database for a Static Site (And Why You Might Want To)
description: "I deleted PostgreSQL, Better Auth, and my entire dashboard from my portfolio. Here's why a static site with JSON files is faster, simpler, and cheaper."
excerpt: "Why I removed my database and went fully static. JSON files + Markdown + build process = faster, simpler, cheaper. No regrets."
date: 2026-06-20
updated: 2026-06-20
image: "/images/blogs/ditched-database-static.jpg"
tags: ["static-site", "architecture", "next.js", "simplicity"]
share: true
featured: true

---

# Why I Ditched My Database for a Static Site (And Why You Might Want To)

Three months ago, my portfolio ran on Next.js with a PostgreSQL database, Better Auth for authentication, a full dashboard for content management, and Drizzle ORM connecting it all together. It was the "proper" way to build it.

It was also slow, fragile, and way more complex than it needed to be.

Last week, I deleted the entire database layer. All of it. The schema, the auth, the dashboard, the ORM, the server actions that queried Postgres — gone. In its place: JSON files, Markdown, and a build process that turns everything into a deployable artifact.

The result? The site is faster, simpler, cheaper to host, and honestly — I haven't missed the database one bit.

Let me walk you through why I made this decision, what I lost, what I gained, and whether you should consider the same.

---

## The Starting Point: A "Normal" Next.js App

My portfolio was structured like most production apps:

- **PostgreSQL** for blog posts, projects, certificates, testimonials, experiences
- **Better Auth** for admin authentication
- **Drizzle ORM** as the database layer
- **A dashboard** where I could CRUD content
- **Server actions** that queried the database on every request
- **PostHog** for analytics (both client and server-side)

This is a perfectly reasonable stack. It's what I'd recommend for a SaaS product, a client project, or any application where multiple users are writing data simultaneously.

But a portfolio? That's a different beast.

---

## The Problem: Complexity Without Purpose

Here's what a single page load looked like:

1. Request hits the Next.js server
2. Server action fires
3. Drizzle ORM builds a SQL query
4. Query goes to PostgreSQL over the network
5. Database parses the query, executes it, returns rows
6. Drizzle maps rows to TypeScript objects
7. Server renders the component with the data
8. HTML is sent to the client

That's 8 steps to display a list of projects that changes maybe once a month.

And the failure points? Let me count them:

- **SSL issues**: My self-hosted Postgres didn't have a CA certificate. The `pg` driver refused to connect without `sslmode=verify-full`. I had to patch the connection code to strip SSL params.
- **Connection limits**: Self-hosted Postgres on a small VPS has limited connections. Under load, requests would queue up and time out.
- **Cold starts**: After a deployment, the first few requests would fail while the database connection pool warmed up.
- **Schema migrations**: Every content change required a migration. Adding a field to the blog posts table? That's a `drizzle-kit push` and a deployment.
- **Auth overhead**: Better Auth added ~40KB to the client bundle for a dashboard I used once a month.

The database wasn't enabling anything. It was in the way.

---

## The Realization: Who Is Writing Data?

The question that changed everything: **who writes data to this site?**

The answer: me. Only me. And I write data by pushing Markdown files and JSON to GitHub.

So why was I going through a database? I wasn't. I was using the database as a glorified cache for content that already lived in files.

Think about it:

- Blog posts? They're Markdown files in `src/content/blogs/`
- Projects? A JSON array in `src/data/projects.json`
- Certificates? JSON in `src/data/certificates.json`
- Testimonials? JSON in `src/data/testimonials.json`
- Experiences? JSON in `src/data/experiences.json`

The database was storing copies of data that already existed in my repository. I was maintaining two sources of truth when I only needed one.

---

## The Migration: How I Did It

The actual migration took about 2 hours. Here's the process:

### Step 1: Export Everything from Postgres

```bash
docker exec postgres-18 pg_dump -U my_portfolio my_portfolio > backup.sql
```

Then I wrote scripts to extract each table into its equivalent JSON file. Blog posts got converted from database rows back into Markdown files with YAML frontmatter.

### Step 2: Replace Database Queries with File Reads

Every server action that looked like this:

```typescript
const posts = await db.select().from(blogPosts).orderBy(desc(blogPosts.date));
```

Became this:

```typescript
import posts from '@/data/blog-posts.json';
```

That's it. No ORM. No connection pool. No SSL configuration. No migration files.

### Step 3: Delete the Database Code

I removed:
- `src/db/` (entire database directory with schema, connection, migrations)
- `src/app/dashboard/` (the admin panel)
- `src/app/actions/` (server actions that wrote to the database)
- `drizzle-orm`, `better-auth`, `@auth/drizzle-adapter`, `pg` (4 npm packages)
- 179 files total

The codebase got noticeably smaller.

### Step 4: Handle the Contact Form

The one piece of dynamic functionality I kept: the contact form. It sends emails via Resend's API — no database needed. The server action simply validates the input with Zod and calls Resend:

```typescript
await resend.emails.send({
  from: 'contact@ahmedlotfy.site',
  to: 'ahmed@example.com',
  subject: `New message from ${name}`,
  text: message,
});
```

No database. No storage. Just an API call.

---

## What I Lost

Let me be honest about the tradeoffs:

**No admin dashboard.** I can't log in and edit content through a UI anymore. Now I edit JSON files or Markdown, commit, and push. For me, this is actually faster — I live in my editor anyway. But if you're a non-technical content editor, this is a real loss.

**No real-time content updates.** With a database, I could update content and it'd be live instantly. Now I need to push to GitHub and wait for the build (about 2 minutes). For a portfolio that changes weekly, this is fine. For a news site, it wouldn't work.

**No user-generated content.** If you need comments, user accounts, or any form of user-submitted data, you need a database (or a third-party service). My portfolio doesn't have any of this, so it wasn't a concern.

**No complex queries.** I can't do `SELECT * FROM posts WHERE tags @> ARRAY['nextjs'] ORDER BY views DESC` anymore. My "queries" are `Array.filter()` and `Array.sort()` on JSON arrays. For hundreds of items, this is instant. For millions, it wouldn't be.

---

## What I Gained

**Speed.** Page loads went from ~200ms (database round-trip included) to ~50ms (reading from memory at build time). The JSON files are imported as modules — they're in memory before the first request even hits.

**Reliability.** No more "500 Internal Server Error" because the database connection dropped. No more SSL handshake failures. No more connection pool exhaustion. The site either builds or it doesn't. If it builds, it runs.

**Simplicity.** My `package.json` went from 45 dependencies to 38. My Dockerfile doesn't need to wait for a database to be healthy before starting. My docker-compose.yml lost an entire service.

**Cost.** I don't need a managed database anymore. No more PlanetScale, no more Neon, no more worrying about compute hours or connection limits. The VPS runs the app and nothing else.

**Developer experience.** `git pull`, edit a JSON file, `git push`. That's the entire content management workflow. No migrations, no schema changes, no `drizzle-kit push`.

---

## The Numbers

| Metric | Before (with DB) | After (static) |
|--------|------------------|----------------|
| Page load (TTFB) | ~200ms | ~50ms |
| Dependencies | 45 | 38 |
| Docker services | 3 (app, worker, db) | 2 (app, worker) |
| Build time | ~45s | ~30s |
| Monthly cost | ~$35 (VPS + managed DB) | ~$4.50 (VPS only) |
| 500 errors/week | 3-5 | 0 |

---

## When You Should (and Shouldn't) Do This

**Ditch the database if:**
- You're the only person creating content
- Content changes infrequently (weekly or less)
- You're comfortable editing files in a code editor
- Your site is read-heavy with minimal writes
- You want to simplify your stack and reduce costs

**Keep the database if:**
- Multiple people need to create/edit content
- You need a non-technical admin interface
- Content changes multiple times per day
- You have user accounts, comments, or user-generated data
- You need complex queries, full-text search, or real-time updates

---

## The Bigger Lesson

This isn't really about databases. It's about choosing the right tool for the job.

We — as developers — have a tendency to build for scale we'll never reach. We add databases, message queues, caching layers, and microservices to projects that serve a few hundred visitors a month. We optimize for hypothetical future requirements instead of actual current needs.

My portfolio doesn't need a database. It never did. I added one because that's what you're "supposed" to do. Unlearning that assumption saved me money, time, and a surprising amount of stress.

The best architecture is the simplest one that solves your actual problem. Not the one that looks impressive on a system design diagram.

---

## Try It Yourself

If you're running a portfolio, blog, or personal site with a database, ask yourself: what would happen if I replaced it with JSON files? You might be surprised how little you'd miss it.

If you want to see the full technical breakdown of how I set up the deployment, check out [How to Self-Host a Next.js Blog on Dokploy](/en/blogs/self-host-nextjs-blog-on-dokploy). And if you're interested in the self-hosting side, my post on [Cloudflare Tunnels for Backend Devs](/en/blogs/the-no-open-ports-manual-cloudflare-tunnels-for-backend-devs) covers how to expose your services without opening ports.

The code for this entire site is on [GitHub](https://github.com/ahmed-lotfy-dev/my-portfolio). Feel free to fork it, break it, and learn from my mistakes.

## Further Reading

- [self-hosting a Next.js blog on Dokploy](/blogs/self-host-nextjs-blog-on-dokploy)
- [self-hosting PostgreSQL](/blogs/master-postgresql-self-hosting-guide-dokploy-vps)
- [React Server Components vs Qwik](/blogs/react-server-components-vs-qwik-real-world-truth)
- [Next.js App Router vs Pages Router in 2026](/blogs/nextjs-app-router-vs-pages-router-2026)
