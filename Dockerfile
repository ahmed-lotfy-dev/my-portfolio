# Install dependencies only when needed
FROM --platform=linux/arm64 node:alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk update && apk add --no-cache libc6-compat && apk add git && apk add nano 
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile


# Rebuild the source code only when needed
FROM --platform=linux/arm64 node:alpine AS builder
# add environment variables to client code
ARG MONGO_URI
ARG BCRYPT_SALT
ARG SENDGRID_API_KEY

ENV MONGO_URI=${MONGO_URI}
ENV BCRYPT_SALT=${BCRYPT_SALT}
ENV SENDGRID_API_KEY=${SENDGRID_API_KEY}

WORKDIR /app

RUN echo -e "MONGO_URI=$MONGO_URI \nBCRYPT_SALT=$BCRYPT_SALT \n SENDGRID_API_KEY=$SENDGRID_API_KEY" > /.env.production

COPY . .

COPY --from=deps /app/node_modules ./node_modules

ARG NODE_ENV=production
RUN echo ${NODE_ENV}
RUN NODE_ENV=${NODE_ENV} yarn build


# Production image, copy all the files and run next
FROM --platform=linux/arm64 node:alpine AS runner
WORKDIR /app
RUN addgroup -g 1001 nodejs && adduser -D -u 1001 -G nodejs nextjs


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