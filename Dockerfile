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

# Stage 3: Production runtime
FROM node:22-alpine AS runner
WORKDIR /app

# Set to production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy standalone output from builder
# The standalone folder contains everything needed to run the app
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Set hostname to accept connections from any IP
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

# Health check for container orchestration
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" || exit 1

# Start the application
CMD ["node", "server.js"]
