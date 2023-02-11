# Install dependencies only when needed
FROM --platform=linux/arm64 node:16-alpine3.17 AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
# RUN apk update && apk add --no-cache libc6-compat && apk add git && apk add nano 
WORKDIR /app

# Install Prisma Client - remove if not using Prisma

COPY prisma ./

# Install dependencies based on the preferred package manager

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml\* ./

RUN \
	if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
	elif [ -f package-lock.json ]; then npm ci; \
	elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i; \
	else echo "Lockfile not found." && exit 1; \
	fi

# Rebuild the source code only when needed
FROM --platform=linux/arm64 node:16-alpine3.17 AS builder
# add environment variables to client code
ARG BCRYPT_SALT
ARG SENDGRID_API_KEY
ARG DATABASE_URL

ENV BCRYPT_SALT=${BCRYPT_SALT}
ENV SENDGRID_API_KEY=${SENDGRID_API_KEY}
ENV DATABASE_URL=${DATABASE_URL}

WORKDIR /app

RUN echo -e "BCRYPT_SALT=$BCRYPT_SALT \n SENDGRID_API_KEY=$SENDGRID_API_KEY" > /.env.production
RUN echo -e "DATABASE_URL=$DATABASE_URL" > /.env

COPY --from=deps /app/node_modules ./node_modules

COPY . .

RUN \
	if [ -f yarn.lock ]; then SKIP_ENV_VALIDATION=1 yarn build; \
	elif [ -f package-lock.json ]; then SKIP_ENV_VALIDATION=1 npm run build; \
	elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && SKIP_ENV_VALIDATION=1 pnpm run build; \
	else echo "Lockfile not found." && exit 1; \
	fi

##### RUNNER

# Production image, copy all the files and run next
FROM --platform=linux/arm64 node:16-alpine3.17 AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs


# You only need to copy next.config.js if you are NOT using the default configuration. 
# Copy all necessary files used by nex.config as well otherwise the build will fail.

COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /.env.production ./
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/app ./app

USER nextjs

# Expose
EXPOSE 3000

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
ENV NEXT_TELEMETRY_DISABLED 1
CMD ["yarn", "start"]






