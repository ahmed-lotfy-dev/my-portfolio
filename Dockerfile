# Multi-stage Dockerfile for Next.js with standalone output
# This reduces final image size by ~80% and improves build caching

# Stage 1: Install production dependencies only
FROM oven/bun:1 AS deps
WORKDIR /app

# Copy dependency files
COPY package.json bun.lock* ./

# Install production dependencies only
# This layer is cached unless package.json or bun.lock changes
RUN bun install --frozen-lockfile --production

# Stage 2: Build the application
FROM oven/bun:1 AS builder
WORKDIR /app

# Copy dependency files
COPY package.json bun.lock* ./

# Install all dependencies (including devDependencies for build)
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Copy environment variables for build time
# Note: Sensitive vars should be provided at build time via --build-arg
ENV NEXT_TELEMETRY_DISABLED=1

# Build the Next.js application
# This creates .next/standalone with minimal production files
RUN bun run build

# Build the Backup Worker
WORKDIR /app/scripts/backup-worker
RUN bun install
RUN bun run build
WORKDIR /app

# Stage 3: Production runtime
FROM oven/bun:1 AS runner
WORKDIR /app

# Set to production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user (Bun image has 'bun' user, we can use that or create one)
# We'll use the default 'bun' user if possible, or stick to 'nextjs' convention but map to valid UID.
# Bun image usually runs as root by default but has 'bun' user.
# Let's create nextjs user for consistency with previous setup.
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 -g nodejs nextjs

# Install PostgreSQL client for backup capabilities (Debian based)
RUN apt-get update && apt-get install -y postgresql-client curl && rm -rf /var/lib/apt/lists/*

# Install PM2 globally using Bun
RUN bun install -g pm2

# Copy standalone output from builder
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Copy Backup Worker
COPY --from=builder --chown=nextjs:nodejs /app/scripts/backup-worker/dist ./backup-worker/dist
COPY --from=builder --chown=nextjs:nodejs /app/scripts/backup-worker/package.json ./backup-worker/package.json
# Install prod deps for worker
WORKDIR /app/backup-worker
RUN bun install --production
WORKDIR /app

# Copy PM2 Config
COPY --from=builder /app/ecosystem.config.js ./ecosystem.config.js

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Set hostname
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD bun -e "fetch('http://localhost:3000/api/health').then(r => process.exit(r.status === 200 ? 0 : 1))" || exit 1

# Start with PM2
CMD ["pm2-runtime", "start", "ecosystem.config.js"]
