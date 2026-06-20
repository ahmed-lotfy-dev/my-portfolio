# ============================================
# Stage 1: Dependencies
# ============================================
FROM oven/bun:1.3.10-alpine AS deps
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# ============================================
# Stage 2: Builder
# ============================================
FROM oven/bun:1.3.10-alpine AS builder
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

ARG NEXT_PUBLIC_POSTHOG_KEY
ARG NEXT_PUBLIC_POSTHOG_HOST
ARG NEXT_PUBLIC_POSTHOG_UI_HOST
ARG BETTER_AUTH_SECRET
ARG BETTER_AUTH_URL

ENV NEXT_PUBLIC_POSTHOG_KEY=${NEXT_PUBLIC_POSTHOG_KEY} \
    NEXT_PUBLIC_POSTHOG_HOST=${NEXT_PUBLIC_POSTHOG_HOST} \
    NEXT_PUBLIC_POSTHOG_UI_HOST=${NEXT_PUBLIC_POSTHOG_UI_HOST} \
    BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET} \
    BETTER_AUTH_URL=${BETTER_AUTH_URL}

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN bun run build

# ============================================
# Stage 3: Cron/Worker
# ============================================
FROM oven/bun:1.3.10-alpine AS cron
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .
RUN chmod +x scripts/start-worker.sh

EXPOSE 3001
CMD ["/bin/sh", "scripts/start-worker.sh"]

# ============================================
# Stage 4: Production Runner
# ============================================
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 -G nodejs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://127.0.0.1:${PORT}/ || exit 1

CMD ["node", "server.js"]
