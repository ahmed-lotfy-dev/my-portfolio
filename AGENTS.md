# Agent Project Instructions

## Communication Style
- Explain the "why" behind each action, the best practices being applied, and architectural concepts involved. The goal is to teach, not just complete tasks.
- Communicate in a human-like, conversational style — like a blog post explaining thought process.
- No emojis in responses.

## Git Workflow
- If `git push` gives SSH error, run: `ssh-add ~/.ssh/github-key`
- Commit messages should be human and match my natural typing style.
- No commits or pushes until explicitly told.
- Always scan for secrets before committing to public repos.

## Next.js / React Best Practices
- Prioritize reusable components. Use feature-driven folder structure: `features/<name>/components/`, `features/<name>/hooks/`, `features/<name>/utils/`.
- Never put more than one component per file (Single Responsibility).
- Keep files under 300 lines — small, focused components.
- Use handler functions for event handlers, never inline.
- On React 19.1+, use new hooks (useOptimistic, useActionState, etc.) — not old patterns.
- Style exclusively with Tailwind CSS when available.
- No comments in code — they're an AI signature. Keep docs separate.
- No direct DOM manipulation, no `window.cookie` — use Next.js/React best practices.
- Add explicit width/height and relevant alt text on all images.
- Use shadcn CLI to install components rather than scaffolding manually.
- For Tauri projects: never use top-level static imports for `@tauri-apps/*` — always dynamic import inside functions/useEffect.
- Use `lru-cache` to cache sessions in memory instead of hitting the DB every request.
- Strict Feature-Driven Architecture: isolate feature domains with their own `components/`, `api/`, `hooks/`, `utils/`.

## Semantic HTML Standards
- Every page must have exactly one `<main>` landmark.
- Use semantic tags: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`, `<figure>`, `<figcaption>`, `<time>`, `<address>`.
- Blog post cards, project cards, certificate cards → `<article>`.
- Navigation menus → `<nav>`.
- Images with context → `<figure>` + `<figcaption>`.
- Contact information → `<address>`.
- Dates → `<time>` with `dateTime` attribute.
- Tags/filter links → `<nav>` with `aria-label`.
- Hero/intro sections → `<header>`.

## PageSpeed Optimization
- Hero LCP image: use `priority`, `loading="eager"`, `fetchPriority="high"`, `sizes`, `placeholder="blur"`.
- Mobile: `order-first` on image so it appears above text.
- Animations: add `margin="-100px"` to viewport to defer triggering.
- Use `useInView` for heavy animations — only render motion when in view.
- Hero text: minimal initial state close to final (e.g. `y: -15` not `-50`).
- For hover effects: use CSS transitions, NOT motion (no JS blocking).
- Static animations: use CSS-only fade/slide on initial load.
