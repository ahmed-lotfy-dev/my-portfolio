---
title: "Docker Compose for Developers — From Zero to Production"
date: 2025-12-20
tags: ["docker", "docker-compose", "deployment", "devops"]
image: "/images/blogs/docker-compose-guide.jpg"
share: true
featured: false
description: "The definitive guide to docker-compose — from your first 'docker compose up' to production-ready deployments with healthchecks, secrets, and multi-environment configs."
---

# Docker Compose for Developers — From Zero to Production

## Why I Wrote This

I run a single VPS. One machine. On it, I've got 15+ containers running at any given time — a Next.js blog, a PostgreSQL database, Redis, a Cloudflare tunnel, monitoring tools, a CI runner, and a handful of side projects that I refuse to kill because "they still work." Managing all of this used to mean writing long `docker run` commands, forgetting half the flags, and then losing everything when I rebooted the server.

Then I actually learned docker-compose properly. Not the "I copied a YAML file from a tutorial" kind of learning — the "I broke production three times and now I understand why each key exists" kind.

This guide is what I wish someone had handed me four years ago. It's not a gentle introduction. It's the real thing: from your first `docker compose up` to a production setup you can trust with actual traffic.

## What Docker Compose Actually Is

Let's skip the "Docker is a containerization platform" paragraph. You know what Docker is, or you wouldn't be here.

Docker Compose is an orchestration tool for multi-container applications. It lets you define your entire stack — every service, network, volume, and environment variable — in a single `docker-compose.yml` file. Then you bring it all up with one command.

That's it. That's the pitch.

What makes it powerful is **declarative infrastructure**. You describe what you want, not how to build it. You say "I need a PostgreSQL database with this password, a Redis cache, and a Node.js app that talks to both," and Compose figures out the ordering, the networking, and the lifecycle.

The modern CLI uses `docker compose` (space, no hyphen) as a plugin built into Docker Engine. The old standalone `docker-compose` binary still works, but you should use the V2 plugin. It's faster, it's maintained, and it supports newer Compose specification features.

## The Anatomy of a docker-compose.yml File

A Compose file is YAML. Indentation matters. Tabs are illegal. I've debugged "mysterious" failures at 2 AM that turned out to be a single tab character. Use spaces.

Here's the skeleton of every Compose file I write:

```yaml
version: "3.9"  # optional in newer spec, but I keep it for clarity

services:
  # Each key is a container name
  app:
    image: node:20-alpine
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      - db
    volumes:
      - ./app:/app
    networks:
      - frontend
      - backend

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: "supersecretpassword"
    volumes:
      - db_data:/var/lib/postgresql/data
    networks:
      - backend

volumes:
  db_data:

networks:
  frontend:
  backend:
```

The top-level keys you need to know:

- **`services`** — Every container you want to run. Each service gets its own key, and Compose uses that key as the DNS name for inter-container communication.
- **`volumes`** — Named volumes that persist data across container restarts. Without these, your database is empty every time you rebuild.
- **`networks`** — Custom networks for isolating traffic. Containers on the same network can talk to each other by service name.
- **`configs`** and **`secrets`** — For Swarm mode, but the pattern of externalizing secrets applies everywhere.

Everything else — `build`, `ports`, `environment`, `depends_on`, `healthcheck`, `restart` — lives under a service definition.

## Your First Real Project: Web App + PostgreSQL + Redis

Let's build something real. A Next.js application with PostgreSQL for data and Redis for caching/sessions. This is the stack I run on my VPS, so every line here is battle-tested.

```yaml
services:
  app:
    build:
      context: ./app
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: "postgresql://appuser:dbpassword123@db:5432/myapp"
      REDIS_URL: "redis://cache:6379"
      NODE_ENV: production
    depends_on:
      db:
        condition: service_healthy
      cache:
        condition: service_started
    networks:
      - app_network
    restart: unless-stopped

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: appuser
      POSTGRES_PASSWORD: dbpassword123
      POSTGRES_DB: myapp
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U appuser -d myapp"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 15s
    networks:
      - app_network
    restart: unless-stopped

  cache:
    image: redis:7-alpine
    command: redis-server --requirepass redispassword456 --maxmemory 128mb --maxmemory-policy allkeys-lru
    volumes:
      - redis_data:/data
    networks:
      - app_network
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:

networks:
  app_network:
    driver: bridge
```

A few things I want to call out:

**`depends_on` with `condition: service_healthy`** — This is critical. Without the healthcheck condition, your app container starts as soon as the PostgreSQL container *process* starts, not when PostgreSQL is actually *ready to accept connections*. I've seen this cause cascading failures on boot. The app crashes, restarts, crashes again, and you're left wondering why your database "doesn't work."

**Redis with a password and memory limits** — The default Redis config has no authentication and no memory cap. In production, that's a security incident and an OOM kill waiting to happen. The `command` override sets a password and caps memory at 128 MB with LRU eviction.

**Named volumes for both databases** — Your data survives container restarts, rebuilds, and even `docker compose down` (unless you add `-v`). This is non-negotiable for stateful services.

## Environment Variables and Secrets Management

Hardcoding passwords in your Compose file is fine for local development. It is not fine for production. Here's how I handle it.

**Option 1: `.env` file (good for single-server deployments)**

Create a `.env` file in the same directory as your `docker-compose.yml`:

```env
POSTGRES_USER=appuser
POSTGRES_PASSWORD=dbpassword123
REDIS_PASSWORD=redispassword456
APP_SECRET=some-random-string-for-sessions
```

Then reference them in your Compose file:

```yaml
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
```

Docker Compose automatically reads `.env`. Variables in the Compose file use `${VAR_NAME}` syntax. If a variable is missing, Compose throws an error by default — you can make it optional with `${VAR_NAME:-defaultvalue}`.

**Add `.env` to `.gitignore`.** I cannot stress this enough. I once committed a database password to a public repo because I forgot. It was embarrassing and expensive.

**Option 2: Environment file with `env_file`**

For services that need many variables:

```yaml
services:
  app:
    env_file:
      - ./app.env
    environment:
      NODE_ENV: production
```

The `env_file` loads key-value pairs directly. Variables set in `environment:` override values from `env_file`.

**Option 3: Docker Secrets (for Swarm, but the pattern applies)**

If you're running Docker Swarm, use the `secrets` top-level key. For single-server setups, I keep secrets in a separate file with restricted permissions:

```bash
echo "supersecretpassword" | sudo tee /run/secrets/db_password
sudo chmod 600 /run/secrets/db_password
```

Then mount it:

```yaml
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
    secrets:
      - db_password

secrets:
  db_password:
    file: /run/secrets/db_password
```

The principle is the same everywhere: **never put secrets in version control, never hardcode them in Dockerfiles, and never pass them as command-line arguments** (they show up in `ps aux`).

## Healthchecks That Actually Work

Most healthchecks I see in tutorials are garbage. They look like this:

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000"]
  interval: 30s
  timeout: 10s
  retries: 3
```

This is bad for several reasons. First, `curl` isn't installed in Alpine-based images. Second, checking the root path doesn't mean your app is healthy — it might return 200 while the database connection is dead. Third, 30 seconds between checks means a failed container can be "unhealthy" for up to 90 seconds before anything reacts.

Here's what I actually use:

**For a web application:**

```yaml
healthcheck:
  test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3000/api/health"]
  interval: 10s
  timeout: 5s
  retries: 3
  start_period: 20s
```

The `/api/health` endpoint should check the database connection, Redis, and any other critical dependency. If any of them are down, return a non-200 status. This is the only healthcheck that means anything.

**For PostgreSQL:**

```yaml
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U appuser -d myapp"]
  interval: 10s
  timeout: 5s
  retries: 5
  start_period: 15s
```

`pg_isready` is included in the PostgreSQL image. It checks whether the server is accepting connections. This is the correct check.

**For Redis:**

```yaml
healthcheck:
  test: ["CMD", "redis-cli", "-a", "redispassword456", "ping"]
  interval: 10s
  timeout: 5s
  retries: 3
```

The `start_period` parameter is important for slow-starting services like databases. During `start_period`, failed healthchecks don't count against the retry limit. Without it, PostgreSQL might fail 3 checks and be marked unhealthy before it even finishes initializing.

## Restart Policies Explained with Real Scenarios

Docker offers four restart policies. Here's what they actually do, not the documentation version:

**`no`** — Never restart. This is the default. If your container exits, it stays dead. Use this for one-shot tasks like database migrations.

```yaml
services:
  migrate:
    image: node:20-alpine
    command: ["npx", "prisma", "migrate", "deploy"]
    restart: no
    depends_on:
      db:
        condition: service_healthy
```

**`always`** — Always restart, regardless of exit code. Even if the container exits cleanly with code 0, Docker will restart it. This sounds useful but it's usually wrong — it creates restart loops for containers that are supposed to exit.

**`unless-stopped`** — Always restart, unless you explicitly stop the container with `docker compose stop` or `docker stop`. This is what I use for 90% of services. It survives crashes, reboots, and Docker daemon restarts.

**`on-failure`** — Only restart if the container exits with a non-zero code. Useful for batch jobs or workers that should stop when they complete successfully but retry on error.

```yaml
services:
  worker:
    build: ./worker
    restart: on-failure
    restart_policy:
      max_attempts: 5
      window: 120s
```

My rule of thumb: **`unless-stopped` for long-running services, `no` for one-shot tasks, `on-failure` for workers.** I almost never use `always`.

## Networking Between Containers

Here's something that trips up every beginner: containers in the same Compose file can talk to each other by service name. You don't need `links`. You don't need to look up IP addresses.

In the example above, the `app` service connects to PostgreSQL using `db:5432` as the hostname. That `db` is the service name from the Compose file. Docker's internal DNS resolves it automatically.

**Why networks are better than links:**

The `links` keyword is legacy. It was the old way to connect containers, and it had problems: it created dependency ordering (which `depends_on` handles now), it injected environment variables that leaked connection details, and it only worked within a single Compose file.

Custom networks give you:

- **Isolation** — Put your database on a network that the frontend can't reach. Only the app service gets access.
- **DNS resolution** — Every container on the same network can reach every other container by service name.
- **Multiple networks** — A service can be on multiple networks, which is how you build DMZ-style architectures.

```yaml
services:
  app:
    networks:
      - frontend
      - backend

  db:
    networks:
      - backend  # Only the app can reach this

networks:
  frontend:
  backend:
    internal: true  # No internet access from this network
```

The `internal: true` flag on the backend network means containers on it can't reach the internet. Your database doesn't need to talk to the outside world, so don't let it.

## Volume Strategies: Bind Mounts vs Named Volumes

This is where I see the most confusion, so let me be direct.

**Named volumes** are managed by Docker. They live in Docker's storage directory (`/var/lib/docker/volumes/` on Linux). You reference them by name in your Compose file.

**Bind mounts** map a specific path on your host machine to a path inside the container.

**When to use named volumes:**

- Database data. Always. You want Docker to manage the storage, and you want the data to survive even if you delete the source code directory.
- Any data that should persist independently of your project directory.

```yaml
volumes:
  postgres_data:
    driver: local
```

**When to use bind mounts:**

- Development, when you want live code reloading. You change a file on your host, and the container sees it immediately.
- Configuration files that you want to edit without rebuilding the container.

```yaml
services:
  app:
    volumes:
      - ./config/app.conf:/etc/app/config.conf:ro  # :ro = read-only
```

**The mistake I made:** I used a bind mount for PostgreSQL data in development. Then I ran `rm -rf ./postgres-data` to "start fresh." I lost three months of seed data, test users, and migration history. Use named volumes for anything you care about.

**Pro tip:** You can combine both. Use a named volume for the database and a bind mount for config files:

```yaml
services:
  db:
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init-scripts:/docker-entrypoint-initdb.d:ro
```

The init scripts in `/docker-entrypoint-initdb.d` run only on first startup, which is perfect for seeding.

## Multi-Stage Builds for Smaller Images

Your production image should not contain your build tools. It should not contain your `node_modules` from development. It should contain the minimum needed to run your application.

Here's a multi-stage Dockerfile for a Next.js app:

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy only what we need from the builder
COPY --from=builder /app/package.json /app/package-lock.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./

USER node
EXPOSE 3000
CMD ["npm", "start"]
```

The builder image is ~500 MB with all dev dependencies. The runner image is ~180 MB with only production dependencies. On a VPS with limited bandwidth and storage, this matters. It also reduces your attack surface — no build tools means no build tools to exploit.

In your Compose file, reference the build context:

```yaml
services:
  app:
    build:
      context: ./app
      dockerfile: Dockerfile
      target: runner  # Explicitly target the runner stage
```

## Production Deployment Checklist

Before you point real traffic at your Compose setup, go through this checklist. I've learned every item on this list the hard way.

- [ ] **No hardcoded secrets.** Use `.env` files, Docker secrets, or a secrets manager. Verify with `grep -r "password" .` before every commit.
- [ ] **Healthchecks on every service.** If a service doesn't have a healthcheck, you don't know if it's working.
- [ ] **`restart: unless-stopped`** on all long-running services. Your server will reboot. Your containers should come back.
- [ ] **Named volumes for all stateful data.** Run `docker volume ls` and verify every database has a named volume.
- [ ] **Resource limits.** Add `deploy.resources.limits` to prevent any single container from eating all your RAM.
- [ ] **Read-only root filesystem** where possible. Add `read_only: true` and use tmpfs for directories that need writes.
- [ ] **Non-root user.** Run containers as a non-root user. In Dockerfiles, add `USER node` or create a dedicated user.
- [ ] **Logging limits.** Without log rotation, containers will fill your disk. Set logging options:

```yaml
services:
  app:
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"
```

- [ ] **Backup strategy.** `docker exec db pg_dump` is not a backup strategy. Write a cron job that dumps, compresses, and uploads to object storage.
- [ ] **Test your recovery.** Delete a container. Delete a volume. Reboot the server. Can you recover? If not, you don't have a production setup.

## Common Mistakes I've Made (And How to Avoid Them)

**Mistake 1: The `latest` tag.** I used `image: postgres:latest` in production. One day, PostgreSQL released a major version update. Docker pulled the new image on rebuild. My database was incompatible with the new version. Data loss. Now I pin exact versions: `postgres:16.4-alpine`.

**Mistake 2: Ignoring `depends_on` conditions.** I had a Node.js app that crashed on every reboot because it tried to connect to PostgreSQL before PostgreSQL was ready. The container was "running" but the database wasn't accepting connections. Adding `condition: service_healthy` fixed it instantly.

**Mistake 3: Not setting memory limits on Redis.** Redis used all available memory, the OOM killer terminated my app container, and my site went down. Now I always set `--maxmemory` and use `restart: unless-stopped`.

**Mistake 4: Using `docker compose down` without reading the docs.** I ran `docker compose down -v` thinking the `-v` flag meant "verbose." It means "remove volumes." I lost my entire database. There was no backup. I spent the next week rebuilding data from browser caches and email receipts.

**Mistake 5: Exposing database ports to the internet.** I had `ports: - "5432:5432"` on my PostgreSQL service because I wanted to connect with pgAdmin from my laptop. A bot found it within 48 hours. Now databases have no published ports. I connect through a [Cloudflare Tunnel](/blogs/cloudflared-tunnel-full-guide) or SSH tunnel instead.

**Mistake 6: Not reading logs.** When something breaks, `docker compose logs` is the first command I run. I used to try random fixes for hours before checking the logs. The logs almost always tell you exactly what's wrong. Read them.

## Further Reading

This post is part of a series on self-hosting and DevOps. If you found it useful, these related posts go deeper on specific topics:

- [Self-Hosting a Next.js Blog on Dokploy](/blogs/self-host-nextjs-blog-on-dokploy) — How I deploy my entire stack with zero-downtime deploys
- [Cloudflare Tunnel: The Complete Guide](/blogs/cloudflared-tunnel-full-guide) — Expose services without opening ports (the right way to access your database remotely)
- [Master PostgreSQL Self-Hosting on a VPS](/blogs/master-postgresql-self-hosting-guide-dokploy-vps) — Everything about running PostgreSQL in production on a budget server
- [Connecting to PostgreSQL Running Inside Docker](/blogs/connecting-to-postgresql-running-inside-docker) — The networking details I glossed over in this post
- [Why I Ditched the Database for a Static Site](/blogs/why-i-ditched-database-for-static-site) — Sometimes the best architecture is no architecture

---

*If you run into issues with your Compose setup, the first place to look is `docker compose logs <service>`. The second place is this blog post. The third place is the [Docker Compose specification](https://docs.docker.com/compose/compose-file/) — it's actually well-written, which is rare for official docs.*
