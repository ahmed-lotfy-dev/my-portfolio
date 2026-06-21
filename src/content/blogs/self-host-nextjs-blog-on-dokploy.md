---

title: How to Self-Host a Next.js Blog on Dokploy (Without Losing Your Mind)
description: "Step-by-step guide to deploying a Next.js blog on Dokploy — from VPS setup to production. No Kubernetes, no Vercel, just Docker and $6/month."
excerpt: "Deploy a Next.js blog on Dokploy in 30 minutes. No Kubernetes, no Vercel — just a VPS, Docker, and $6/month. Full tutorial with real mistakes and fixes."
date: 2026-06-20
updated: 2026-06-20
image: /images/blogs/dokploy-nextjs-blog.jpg
tags: ["self-hosting", "next.js", "dokploy", "deployment"]
share: true
featured: true

---

# How to Self-Host a Next.js Blog on Dokploy (Without Losing Your Mind)

Let me tell you something that took me way too long to figure out: deploying a Next.js app doesn't need to be complicated. You don't need Kubernetes. You don't need AWS ECS. You don't need to pay $40/month for Vercel's team plan just because you want server actions.

You need a VPS, Dokploy, and about 30 minutes.

I recently rebuilt my entire portfolio — a Next.js blog with server actions, contact forms, multilingual routing, Markdown-based content — and deployed it on a self-hosted Dokploy instance. Total hosting cost: $6/month for the VPS. That's it.

Here's exactly how I did it, and more importantly, the mistakes that cost me hours so you don't have to repeat them.

---

## What Is Dokploy and Why Should You Care?

Dokploy is an open-source alternative to Vercel/Netlify/Render. Think of it as a self-hosted PaaS. You run it on your own VPS, point it at your GitHub repo, and it handles:

- Building your Docker image
- Running your container
- SSL certificates (via Let's Encrypt)
- Reverse proxy (via Traefik)
- Preview deployments
- Rollbacks

The UI looks and feels like a simplified Vercel dashboard. If you've ever used Vercel, you'll feel at home in about 2 minutes.

The key difference: you own everything. No vendor lock-in. No "you've exceeded your bandwidth" emails. No surprise bills.

---

## The Architecture: What We're Building

Here's what the final setup looks like:

```
GitHub Repo
    │
    ▼
Dokploy (watches main branch)
    │
    ▼
Docker Compose (multi-stage Dockerfile)
    │
    ├── web container (Next.js, node:22-alpine)
    └── worker container (Bun cron jobs, oven/bun:1.3.10-alpine)
    │
    ▼
Traefik (reverse proxy + SSL)
    │
    ▼
yourdomain.com
```

Two containers. One reverse proxy. One VPS. That's the whole thing.

---

## Step 1: The Dockerfile That Actually Works

This is where most tutorials fail. They give you a Dockerfile that works locally but breaks in production. Here's what I landed on after about 5 iterations:

```dockerfile
# ============================================
# Stage 1: Dependencies
# ============================================
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# ============================================
# Stage 2: Builder
# ============================================
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

# ============================================
# Stage 3: Runner
# ============================================
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]
```

A few things I want to call out:

**Why `output: "standalone"` in `next.config.ts`?** This tells Next.js to create a minimal server bundle that only includes the files actually used by your routes. It's smaller, faster, and what you want in a container. Do NOT use `output: 'export'` if you have server actions — it strips them entirely.

**Why non-root user?** Because running containers as root is a security nightmare. The `nextjs` user with UID 1001 can't touch anything outside the app directory.

**Why `bun install --frozen-lockfile`?** In production, you want deterministic installs. If your lockfile doesn't match your package.json, this fails fast instead of silently installing different versions.

---

## Step 2: Docker Compose (Keep It Simple)

```yaml
services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
    expose:
      - "3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - RESEND_API_KEY=${RESEND_API_KEY}
    restart: unless-stopped

  worker:
    build:
      context: .
      dockerfile: Dockerfile.worker
    environment:
      - DATABASE_URL=${DATABASE_URL}
    restart: unless-stopped
```

Notice I'm using `expose` not `ports`. Dokploy handles the reverse proxy via Traefik, so you don't need to bind ports to the host. This is cleaner and avoids port conflicts.

**Common mistake**: Putting environment variables directly in the compose file. Don't. Use `${VAR_NAME}` syntax — Dokploy injects these from the environment configuration in the UI.

---

## Step 3: Setting Up Dokploy

1. **Install Dokploy on your VPS:**

```bash
curl -sSL https://dokploy.com/install.sh | sh
```

2. **Access the dashboard** at `http://your-vps-ip:3001` (Dokploy itself runs on port 3001)

3. **Create a new application:**
   - Go to Applications → New
   - Choose "Docker Compose" as the provider
   - Connect your GitHub repo
   - Select the branch (usually `main`)

4. **Set environment variables** in the Dokploy UI:
   - `DATABASE_URL=postgresql://user:password@postgres:5432/dbname`
   - `RESEND_API_KEY=re_xxxxxxxx`

5. **Click Deploy.**

That's it. Dokploy will clone your repo, run `docker compose up -d --build`, and if everything works, your site is live.

---

## Step 4: Connecting a Domain

This part confused me for a while, so let me save you the headache:

1. Point a DNS A record from your domain to your VPS IP
2. In Dokploy, go to your app → Domains → Add Domain
3. Enter your domain (e.g., `ahmedlotfy.site`)
4. Enable "HTTPS" — Dokploy will request a Let's Encrypt certificate automatically
5. Wait 30-60 seconds

Done. Your site is served over HTTPS with auto-renewing certificates.

I use Cloudflare as my DNS provider (not as a proxy — just DNS). This means I get Cloudflare's DNS speed without their proxy interfering with Let's Encrypt certificate issuance.

---

## Step 5: Adding a Database (Optional but Likely Needed)

If your app needs a database, Dokploy can run Postgres as a separate container. Here's what I learned the hard way:

**SSL doesn't work in self-hosted Postgres without a CA certificate.** My Next.js app was failing with `The server does not support SSL connections`. The fix was adding `sslmode=disable` to the connection string:

```
DATABASE_URL=postgresql://user:password@postgres-18:5432/mydb?sslmode=disable
```

But here's the thing — even `sslmode=disable` doesn't always work because Node's `pg` driver treats it differently. The real fix is editing `postgresql.conf` inside the container:

```conf
ssl = off
```

And restarting the container. This is a known issue with pgwire (the Postgres wire protocol used by some drivers).

---

## The Gotchas That Wasted My Time

Let me save you some hours:

### Gotcha 1: Build succeeds, runtime fails

Your Dockerfile build might pass but the container crashes on startup. Check the logs in Docker:

```bash
docker logs <container-id>
```

Common cause: missing environment variables. If your app reads `process.env.DATABASE_URL` at the module level (not inside a function), it'll fail at startup if the variable isn't set.

### Gotcha 2: "Cannot find module" errors in Docker

This usually means your `.dockerignore` is wrong or you're missing files in the COPY step. Make sure your `.dockerignore` doesn't exclude files your build needs.

### Gotcha 3: Changes not reflecting after deploy

Docker caches layers aggressively. If you change application code but the build uses cached layers, your new code won't be included. Force a clean rebuild:

```bash
docker compose build --no-cache
```

In Dokploy, toggle "Clean Build" in the deployment settings.

### Gotcha 4: Server Actions not working

If you use Next.js server actions and deployed with `output: 'export'`, they're gone. Server actions require a running server node. Use `output: "standalone"` instead.

---

## The Result

My portfolio is now fully self-hosted. The blog renders 19 posts from Markdown files. The contact form sends emails via Resend. The testimonials are powered by a JSON file. Everything builds from scratch on every push to `main`.

Total monthly cost:

| Service | Cost |
|---------|------|
| VPS (Hetzner CX11) | $3.75/month |
| Domain | ~$10/year |
| Resend (free tier) | $0 |
| Dokploy (open source) | $0 |
| **Total** | **~$4.50/month** |

Compare that to Vercel Pro ($20/month) + PlanetScale ($29/month) + hosting images on a CDN. Self-hosting is cheaper, and you learn a ton about deployment in the process.

---

## Should You Do This?

Honest answer: it depends.

**Do it if:**
- You want to learn how deployment actually works
- You're comfortable with Docker and basic Linux
- You want full control over your infrastructure
- You're deploying side projects or portfolio sites

**Don't do it if:**
- You need 99.99% uptime (use Vercel/Netlify)
- You have zero interest in infrastructure
- Your team expects push-to-deploy with zero config
- You're running a revenue-critical application (yet)

For a portfolio, a blog, or a side project? Self-hosting on Dokploy is a no-brainer.

If you want to see a live example of this exact setup, check out [my portfolio](/en) — it's running this way right now. And if you're curious about how the multilingual routing works with Next.js App Router, I wrote about that in [React Server Components vs Qwik: Real-World Cross-Platform Truth](/en/blogs/react-server-components-vs-qwik-real-world-truth).

Questions? Hit me up on [Telegram](https://t.me/ahmed_lotfy_dev) — I'm always happy to help someone avoid the mistakes I made.

## Further Reading

- [self-hosting PostgreSQL on Dokploy](/blogs/master-postgresql-self-hosting-guide-dokploy-vps)
- [securing your deployment with Cloudflare Tunnel](/blogs/cloudflared-tunnel-full-guide)
- [connecting to PostgreSQL inside Docker](/blogs/connecting-to-postgresql-running-inside-docker)
- [why I ditched my database for a static site](/blogs/why-i-ditched-database-for-static-site)
- [Cloudflare Tunnels for backend developers](/blogs/the-no-open-ports-manual-cloudflare-tunnels-for-backend-devs)
