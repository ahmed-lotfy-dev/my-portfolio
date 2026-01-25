# 🏗️ Modern Web Design Patterns: React & Next.js Edition

This guide breaks down the core architectural and design patterns used in professional-grade React and Next.js applications. Understanding these patterns helps you build scalable, maintainable, and "human-readable" code.

---

## 1. Feature-Driven Development (FDD)
*The architecture you are currently using.*

### Concept
Instead of grouping files by **technical type** (all components in one folder, all actions in another), you group them by **feature** (everything related to "Blog", everything related to "Authentication").

### Structure Example
```text
src/
  features/
    blog/
      components/
      actions/
      utils/
      schema.ts
    auth/
      components/
      actions/
```

### Why it's Senior Level:
- **Locality**: If you need to change a blog feature, all relevant files are in one folder.
- **Scalability**: New features don't clutter existing folders.

---

## 2. Server Actions Pattern
*The primary pattern for data mutation in Next.js 14+.*

### Concept
Special asynchronous functions that run on the server but can be called directly from your React components (even client components).

### Variant A: Unified Actions (Your Preference)
Consolidating all server-side logic (fetching, syncing, deleting) into one file like `postsActions.ts`.
- **Pros**: 100% consistency, easy for others to find logic.
- **Cons**: Can result in "God Files" if the feature is too large.

### Variant B: CRUD Actions
Separating actions by intent: `createPost.ts`, `updatePost.ts`, etc.
- **Pros**: Perfectly clean, easy to unit test.

---

## 3. Service / Repository Pattern
*The pattern I initially adapted (Common in Enterprise apps).*

### Concept
- **Repository**: Handles the "How" of data. Does it come from SQL? Redis? A JSON file? The UI doesn't care.
- **Service**: Handles the "What" (Business logic). E.g., "When a post is synced, also notify the admin."

### Comparison:
| Aspect | Server Action Pattern | Service/Repository Pattern |
| :--- | :--- | :--- |
| **Simplicity** | High (Direct call) | Moderate (Multiple layers) |
| **Abstraction** | Low (UI knows the DB) | High (UI knows "The Repo") |
| **Use Case** | Most Next.js apps | Large-scale enterprise systems |

---

## 4. The "Sync Station" Pattern
*The specific variant we built for your Obsidian Blog.*

### Concept
Instead of fetching data "Live" for every user (Live-Fetch Pattern), you build a **Sidecar Sync**.
1.  **Event**: You push code to Git.
2.  **Sync**: A background worker (or Webhook) pulls the new data.
3.  **Cache**: Data is saved to a local high-performance DB (PostgreSQL).
4.  **Serve**: Users only ever talk to the SQL cache.

### Why we used it:
- To bypass third-party API rate limits (GitHub 403 Forbidden).
- To guarantee 100% uptime even if the upstream source is down.

---

## 5. UI Design Patterns (Frontend)

### A. Compound Components
Used when multiple components work together to manage shared state (e.g., `<Select>` and `<Option>`).
- **Best Practice**: Use React Context internally so the parent manages the active item.

### B. Container/Presentational (The "Smart vs Dumb" Pattern)
- **Container**: Handles fetching data and logic.
- **Presentational**: Just takes props and renders beautiful UI.
- *Note: In Modern React, this is often replaced by **Custom Hooks**.*

---

## 6. Optimization Patterns

### A. The "Islands" Architecture (Simplified)
Next.js naturally handles this. Keep the majority of your page as **Server Components** (static/no-JS) and only use `"use client"` for small "islands" of interactivity (buttons, forms).

### B. Skeleton Pattern
Instead of showing a "Loading..." text, render a greyed-out shape of the UI to reduce cumulative layout shift (CLS).

---

## 🦾 Summary Checklist for High-Quality Code:
1.  **Locality**: Keep logic close to where it's used.
2.  **Single Source of Truth**: Don't duplicate data between DB and Local State.
3.  **Consistency**: If you start with Server Actions, finish with Server Actions.
4.  **Resilience**: Always assume your external API (like GitHub) will fail or slow down.
