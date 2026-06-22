---
title: "Next.js App Router vs Pages Router — When to Use Each in 2026"
date: 2026-06-22
tags: ["next.js", "react", "app-router", "pages-router", "architecture"]
image: "/images/blogs/nextjs-routers-comparison.jpg"
share: true
featured: false
description: "I've built production apps with both routers. Here's my honest take on when to use App Router vs Pages Router in 2026, with real code examples and migration patterns."
---

# Next.js App Router vs Pages Router — When to Use Each in 2026

## The Question I Keep Getting Asked

Just last month, a client came to me with a straightforward request: "We have a Next.js app built two years ago. Should we migrate to App Router before our next big feature rollout?" I get some version of this question at least twice a month — from startup founders, freelance clients, and junior devs on Discord who inherited a codebase.

The answer is never "just switch to App Router." It's never "Pages Router is dead, obviously." The answer is more nuanced than that, and after shipping production apps with both routers — including a SaaS dashboard, an e-commerce storefront, and a content-heavy blog that gets 50K monthly visits — I've developed strong opinions about when each one makes sense.

This post is the answer I wish someone had given me in 2023 when I was making these decisions without a playbook. I'll walk you through the real architectural differences, when each router wins, how to migrate incrementally, and the mistakes I see teams make over and over.

## A Brief History: Why Next.js Created App Router

The Pages Router wasn't just "the old way." For years, it was the only way, and it was genuinely good. `getServerSideProps`, `getStaticProps`, `getInitialProps` — these patterns solved real problems. They gave us SSR when we needed it, SSG for performance, and ISR for the best of both worlds.

So why did the Next.js team build an entirely new routing system?

The short answer: React Server Components. The Pages Router was designed in an era where React components ran exclusively on the client or were rendered to HTML on the server during a request. There was no concept of components that *only* run on the server, streaming partial UI to the client as data resolves.

React 18 introduced Server Components as a first-class concept. But the Pages Router's architecture — with its `_app.tsx` wrapper, its `getPageProps` mental model, and its tight coupling to the client-side hydration cycle — couldn't cleanly accommodate components that never ship JavaScript to the browser.

The App Router was built from the ground up around three ideas:

1. **Server components by default** — every component is a Server Component unless you explicitly opt in with `"use client"`.
2. **Nested layouts with shared UI** — not a custom `_app` + `_document` hack, but a real layout system that persists across navigations without re-rendering.
3. **Streaming and selective hydration** — the ability to show a page skeleton immediately and stream in content as data arrives, per-section.

This wasn't a rewrite for the sake of rewriting. It was a necessary architectural shift to unlock patterns the Pages Router physically couldn't support.

## The Architectural Difference in One Paragraph

Both routers use file-system routing — your file structure becomes your URL structure. But under the hood, they're fundamentally different. The Pages Router treats every page as a client-side React app that may or may not be pre-rendered on the server. Data fetching happens through special functions (`getServerSideProps`, `getStaticProps`) that run at request time or build time, and the entire page hydrates as one unit on the client. The App Router flips this: every component is a Server Component by default, meaning it runs on the server, fetches its own data, and renders to HTML — no client JavaScript shipped for that component. You opt into client-side interactivity with `"use client"`, and data fetching uses `async/await` directly in the component body instead of a separate props function. The result is a model where the server does more work, the client does less, and you get streaming, nested layouts, and per-segment caching for free.

## App Router: When It Shines

I reach for App Router in 2026 for almost every new project. Here's where it genuinely excels:

### 1. Content-Heavy Sites with Complex Layouts

If you're building a dashboard, a documentation site, or a blog with nested navigation, the App Router's layout system is a game-changer. I recently rebuilt a client's knowledge base using nested layouts, and the DX improvement was dramatic.

```tsx
// app/docs/[...slug]/page.tsx
import { getDocument } from '@/lib/docs';

export default async function DocPage({ params }: { params: { slug: string[] } }) {
  const doc = await getDocument(params.slug.join('/'));

  return (
    <article className="prose dark:prose-invert max-w-none">
      <h1>{doc.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: doc.content }} />
    </article>
  );
}
```

```tsx
// app/docs/layout.tsx
import { DocsSidebar } from '@/components/docs-sidebar';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-8">
      <DocsSidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
```

The sidebar persists across page navigations. No re-fetching, no layout shift, no `useEffect` hacks to keep state alive. The Pages Router can't do this without significant effort.

### 2. Apps That Need Streaming SSR

When I built a real-time analytics dashboard for a logistics client, the App Router's `loading.tsx` and streaming capabilities saved us weeks of loading-state engineering.

```tsx
// app/dashboard/loading.tsx
export default function DashboardLoading() {
  return (
    <div className="grid grid-cols-3 gap-4 animate-pulse">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonChart />
    </div>
  );
}
```

```tsx
// app/dashboard/page.tsx
import { Suspense } from 'react';
import { LiveMetrics } from '@/components/live-metrics';
import { HistoricalChart } from '@/components/historical-chart';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<SkeletonMetrics />}>
        <LiveMetrics />
      </Suspense>
      <Suspense fallback={<SkeletonChart />}>
        <HistoricalChart />
      </Suspense>
    </div>
  );
}
```

The shell renders instantly. Each section streams in independently. If the historical chart takes 2 seconds to query the database, the user still sees the live metrics immediately. In the Pages Router, you'd either wait for everything or build a complex client-side loading orchestration.

### 3. Full-Stack Apps with Server Actions

Server Actions are, in my opinion, the most underrated feature of the App Router. I use them for form handling, mutations, and even complex multi-step workflows.

```tsx
// app/projects/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';

export async function createProject(formData: FormData) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;

  const project = await db.project.create({
    data: { name, description },
  });

  revalidatePath('/projects');
  return project;
}
```

```tsx
// app/projects/new/page.tsx
import { createProject } from '../actions';

export default function NewProjectPage() {
  return (
    <form action={createProject}>
      <input name="name" required />
      <textarea name="description" />
      <button type="submit">Create Project</button>
    </form>
  );
}
```

No API route. No `fetch` call. No `useState` for form state. The form works without JavaScript if you need it to. This is dramatically simpler than the Pages Router equivalent.

## Pages Router: When It's Still the Right Choice

I'm not going to pretend the Pages Router is obsolete. There are real scenarios where I'd choose it today — or at least where I'd not bother migrating existing code.

### 1. Stable Production Apps That Don't Need New Features

I have a client running an e-commerce storefront on Pages Router (Next.js 14) that processes about $200K/month. It's stable, it's fast, and the team knows it inside out. Migrating to App Router would take weeks, introduce regressions, and deliver zero business value. The "newer is better" fallacy has cost real companies real money.

If your Pages Router app is working well and you're adding features incrementally, stay put. The Pages Router is still fully supported and receives security updates.

### 2. Teams That Need to Ship Yesterday

The App Router has a steeper learning curve. Server Components, the `"use client"` boundary, caching behavior that changes between environments — these are concepts that trip up even experienced React developers. I've seen teams lose weeks debugging why their `fetch` calls were being cached unexpectedly or why their client component wasn't receiving props from a server component.

If you're a small team under deadline pressure and you know the Pages Router well, use it. The productivity gain from using a familiar tool often outweighs the architectural benefits of the App Router.

### 3. Apps That Rely Heavily on Client-Side State

If your app is essentially a client-side SPA that happens to use Next.js for routing — think Figma-like tools, complex drag-and-drop interfaces, or real-time collaborative editors — the Pages Router's model is simpler. Everything is a client component, data fetching happens in `useEffect` or through React Query, and you don't have to think about server/client boundaries.

```tsx
// pages/editor/[docId].tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { DocumentCanvas } from '@/components/document-canvas';

export default function EditorPage() {
  const router = useRouter();
  const { docId } = router.query;
  const [doc, setDoc] = useState(null);

  useEffect(() => {
    if (!docId) return;
    fetch(`/api/documents/${docId}`)
      .then(res => res.json())
      .then(setDoc);
  }, [docId]);

  if (!doc) return <Loading />;

  return <DocumentCanvas document={doc} />;
}
```

This pattern is straightforward, well-understood, and doesn't require thinking about serialization boundaries or server component passthrough.

### 4. When You Need Mature Ecosystem Compatibility

Some libraries still haven't fully caught up to Server Components. If you depend on libraries that assume client-side React (older versions of certain charting libraries, some animation frameworks, or legacy internal packages), the Pages Router avoids the compatibility headaches.

## The Migration Path: Moving from Pages to App Router Incrementally

This is the part most tutorials skip. You don't have to rewrite everything at once. Next.js supports both routers in the same project, and I've used this to migrate real apps piece by piece.

Here's the strategy I use:

**Step 1: Move your pages to the `pages/` directory (if they aren't already) and create an `app/` directory alongside it.**

```
my-app/
├── pages/          # Existing Pages Router
│   ├── _app.tsx
│   ├── index.tsx
│   └── api/
├── app/            # New App Router
│   └── (new features)/
├── next.config.js
```

**Step 2: Update `next.config.js` to handle both:**

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // This enables the App Router alongside Pages Router
  },
};

module.exports = nextConfig;
```

**Step 3: Start new features in the App Router.** Don't migrate existing pages until you have a reason. New routes go in `app/`.

**Step 4: Migrate high-value pages first.** Usually this means your landing page (benefits from streaming SSR) or your content pages (benefits from nested layouts).

**Step 5: Handle shared components carefully.** Components that work in both routers need to be free of `"use client"` directives if they're used in Server Components. I keep a `shared/` directory for framework-agnostic UI components.

**Step 6: Move API routes.** App Router uses Route Handlers instead of API routes. The migration is mechanical:

```ts
// pages/api/users.ts (old)
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.json({ users: [] });
}
```

```ts
// app/api/users/route.ts (new)
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ users: [] });
}
```

The key gotcha: Route Handlers don't have the same `req/res` Node.js objects. You work with Web `Request` and `Response` instead. It takes about an hour to get used to.

## Performance Comparison: Real Numbers from My Experience

I migrated a content marketing site (40 pages, mostly SSG with some SSR) from Pages Router to App Router and tracked the results:

| Metric | Pages Router | App Router | Change |
|--------|-------------|------------|--------|
| Lighthouse Performance Score | 78 | 94 | +20.5% |
| Time to Interactive (mobile) | 3.2s | 1.8s | -43.7% |
| First Contentful Paint | 1.4s | 0.9s | -35.7% |
| JavaScript shipped (homepage) | 287KB | 142KB | -50.5% |
| Build time (SSG) | 4m 12s | 3m 48s | -9.5% |

The biggest win was JavaScript reduction. Server Components don't ship their code to the client, so pages that were mostly content saw massive bundle size reductions. The TTI improvement was the most noticeable — users on slow connections reported the site feeling "instant" compared to before.

For the e-commerce storefront I mentioned earlier, the numbers were even more dramatic. The product listing page went from 412KB of JavaScript to 189KB, primarily because the product grid, filters, and recommendation widgets all became Server Components.

Your mileage will vary. If your app is already heavily optimized with dynamic imports and code splitting in the Pages Router, the gains will be smaller. But for most apps I've worked on, the App Router delivers a meaningful performance improvement out of the box.

## The "Use Both" Strategy: How I Structure New Projects in 2026

Here's my actual approach for new projects in 2026:

1. **Start with App Router for everything.** It's the default. New features, new pages, new API endpoints — all go in `app/`.

2. **Use Pages Router for specific edge cases.** If I hit a library that doesn't work with Server Components, or if I need a quick prototype that doesn't benefit from streaming, I drop it in `pages/`.

3. **Keep the marketing/blog site in App Router.** The performance benefits for content sites are too significant to ignore. If you're self-hosting your Next.js app (I wrote about my [Dokploy setup](/blogs/self-host-nextjs-blog-on-dokploy)), every KB of JavaScript you don't ship is bandwidth you're not paying for.

4. **Use Route Handlers for APIs, but keep the option of Pages API routes.** Route Handlers are cleaner, but if you have existing middleware or API patterns that rely on the Node.js `req/res` objects, Pages API routes still work.

5. **Deploy behind Cloudflare Tunnel.** I use [Cloudflare Tunnels](/blogs/cloudflared-tunnel-full-guide) to expose my self-hosted apps, and the App Router's streaming works perfectly over it. No issues with WebSocket or SSE.

The key insight: these aren't competing systems. They're complementary tools in the same framework. The "use both" strategy isn't a compromise — it's pragmatism.

## Common App Router Mistakes I See (With Fixes)

### Mistake 1: Adding `"use client"` to Everything

I see this constantly. A developer new to App Router gets confused by a serialization error, adds `"use client"` to their top-level page component, and suddenly they've negated every benefit of Server Components.

**The fix:** Only add `"use client"` when you actually need browser interactivity — `onClick`, `useState`, `useEffect`, event listeners. If your component just renders data, it should be a Server Component.

```tsx
// ❌ Wrong: Making the whole page a client component
'use client';
export default function Page() {
  const [items, setItems] = useState([]);
  // ...
}

// ✅ Right: Server Component with a small client island
export default async function Page() {
  const items = await getItems();
  return <ItemList items={items} />;
}
```

### Mistake 2: Not Understanding the Caching Behavior

App Router caches `fetch` calls by default in production. This is great for performance but terrible for debugging when you expect fresh data on every request.

**The fix:** Be explicit about caching:

```tsx
// Cached by default (good for static content)
const data = await fetch('https://api.example.com/posts');

// No cache (good for real-time data)
const data = await fetch('https://api.example.com/live-stats', {
  cache: 'no-store',
});

// Revalidate every 60 seconds (good for semi-dynamic content)
const data = await fetch('https://api.example.com/trending', {
  next: { revalidate: 60 },
});
```

### Mistake 3: Forgetting That Props Must Be Serializable

You can't pass functions, class instances, or React elements from Server Components to Client Components. They need to be serialized across the boundary.

**The fix:** Restructure your data flow:

```tsx
// ❌ This will crash
<ClientComponent onClick={() => console.log('hi')} />

// ✅ Use Server Actions instead
<form action={handleSubmit}>...</form>
```

### Mistake 4: Not Using `loading.tsx` and `error.tsx`

The App Router gives you `loading.tsx`, `error.tsx`, and `not-found.tsx` for every route segment. Not using them means you're missing out on free UX improvements.

**The fix:** Always create at least a `loading.tsx` for routes that fetch data. It makes your app feel faster and prevents unstyled content flashes.

### Mistake 5: Over-Nesting Layouts

Just because you *can* nest 5 levels of layouts doesn't mean you should. I've seen route groups nested so deeply that the file structure became harder to navigate than the actual UI.

**The fix:** Use route groups `(folder)` to organize without adding URL segments, and keep nesting to 2-3 levels maximum unless you have a genuinely complex information architecture.

## My Decision Framework: A Simple Flowchart

When someone asks me "which router should I use?", I run through this mental checklist:

**Use App Router if:**
- You're starting a new project (default choice in 2026)
- Your app has complex, nested UI layouts
- You want streaming SSR or partial prerendering
- You're building a content-heavy site (blog, docs, marketing)
- You want to use Server Actions for mutations
- Performance (especially JavaScript bundle size) matters
- Your team has time to learn the new patterns

**Use Pages Router if:**
- You have an existing Pages Router app that's stable and working
- Your team is under tight deadlines and knows Pages Router well
- Your app is primarily client-side interactive (SPA-like)
- You depend on libraries that don't support Server Components yet
- You're migrating incrementally and haven't gotten to the migration yet

**Use both if:**
- You're migrating from Pages to App Router
- You have a stable Pages Router app but want to build new features in App Router
- You need specific Pages Router patterns (certain API route patterns, specific middleware)

The bottom line: in 2026, the App Router is the right default for new projects. But the Pages Router is not dead, and pretending otherwise helps no one. Choose the tool that fits your context, not the one that's trending on Twitter.

## Further Reading

If you're going down the rabbit hole of self-hosting and optimizing your Next.js apps, these posts from my blog cover the infrastructure side of things:

- [Self-Host Your Next.js Blog on Dokploy](/blogs/self-host-nextjs-blog-on-dokploy) — How I moved my blog off Vercel and onto my own server
- [Cloudflare Tunnel Full Guide](/blogs/cloudflared-tunnel-full-guide) — Exposing self-hosted apps safely without opening ports
- [Master PostgreSQL Self-Hosting on Dokploy VPS](/blogs/master-postgresql-self-hosting-guide-dokploy-vps) — Running your own database alongside your apps
- [Connecting to PostgreSQL Running Inside Docker](/blogs/connecting-to-postgresql-running-inside-docker) — The networking setup that actually works
- [Why I Ditched a Database for a Static Site](/blogs/why-i-ditched-database-for-static-site) — When removing the backend is the right call

Happy routing. And if you're still on Pages Router in 2027, that's fine too — your app still works, and that's what matters.
