---

title: "⚛️ Tanner Linsley Built a React Clone in One Day — Here's Why It Matters"
date: 2026-05-09
tags: ["tanstack", "react", "frontend", "performance"]
image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&q=80"
share: true
featured: false

---

Last week, Tanner Linsley — creator of TanStack Query, Table, Router, and half the libraries keeping modern React apps alive — did something that turned heads in the frontend community. He spent a day prompting an AI agent to regenerate React's public API as a ~9KB runtime, quietly shipped it on his blog and tanstack.com, and just *moved on*.

The result? A React-compatible runtime that runs 2–3× faster than stock React, scoped specifically to TanStack Start.

Let me unpack why this matters — not just as a neat demo, but as a signal about where frontend is heading.

## What Actually Happened

Tanner took the public React API surface — `useState`, `useEffect`, `createContext`, `createElement`, the whole works — and had an AI agent reimplement it from scratch. The output is a ~9KB runtime that's API-compatible with React but optimized for TanStack Start's specific needs.

```jsx
// This works exactly like you'd expect — just faster
import { useState, useEffect } from '@tanstack/react-like'

function Counter() {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    document.title = `Count: ${count}`
  }, [count])
  
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}
```

The key insight: by shedding backwards compatibility with legacy React patterns and optimizing for a specific router/framework context, you can drop significant runtime overhead.

## Why 2–3× Faster?

Stock React carries decades of design decisions. The reconciler, the event system, the fiber architecture — all built for maximum flexibility across every possible use case. That's the right call for a general-purpose library. But if you're building a framework with known constraints (like TanStack Start's file-based routing and streaming SSR), you can make aggressive optimizations:

- **Simplified reconciliation**: If you know the component tree shape at build time, you can skip runtime work
- **Smaller bundle**: 9KB gzipped vs React's ~42KB means less parsing and less memory
- **Specialized scheduling**: No need for concurrent mode's complexity when your routing guarantees certain patterns

## The Bigger Picture: AI-Generated Framework Internals

The most provocative part of this story isn't the performance numbers — it's *how* it was built. An AI agent generated this in a single day. That's a capability we haven't fully processed yet.

Think about what this unlocks:

- **Framework experimentation becomes cheap**: Want to try a different reconciliation algorithm? Describe it, let the AI build it, benchmark, iterate.
- **Domain-specific runtimes**: E-commerce sites don't need the same React features as data dashboards. Custom runtimes tailored to your workload become feasible.
- **Teaching tools**: A stripped-down React clone is the best way to understand how React works internally. This could be an incredible educational resource.

## Should You Use It?

Probably not in production — at least not yet. Tanner himself isn't properly releasing it (though it's on npm if you're curious). It's an experiment, a proof of concept, and a glimpse of what's coming.

But the pattern is worth paying attention to. We're entering an era where:

1. Framework internals become a commodity (AI can generate them)
2. Performance optimization moves from "general case" to "specific use case"
3. The boundary between framework author and framework consumer blurs

## The Bottom Line

Tanner's React clone isn't a replacement for React. It's a harbinger. When a framework's public API can be reimplemented in a day by an AI and run 2–3× faster, it tells us that React's value has shifted from its implementation to its ecosystem, conventions, and developer experience.

The next time someone tells you a piece of infrastructure is "too complex to rebuild," remember: someone just rebuilt React in a day.
The performance principles TanStack uses are the same ones I applied when building this portfolio — minimal JS, server rendering, edge deployment. See how [React Server Components compare to Qwik](/en/blogs/react-server-components-vs-qwik-real-world-truth) in practice.

Curious about the actual build tooling? My post on [Frontend Build Tools Hitting a Wall](/en/blogs/frontend-build-tools-hitting-a-wall) covers what comes next.

## Further Reading

- [React Server Components vs Qwik](/blogs/react-server-components-vs-qwik-real-world-truth)
- [frontend build tools hitting a wall](/blogs/frontend-build-tools-hitting-a-wall)
