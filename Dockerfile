# FROM node:19-alpine as dependencies
# WORKDIR /my-portofolio
# COPY package.json yarn.lock ./
# RUN yarn install --frozen-lockfile

# FROM node:19-alpine as builder
# WORKDIR /my-portofolio
# COPY . .
# COPY --from=dependencies /my-portofolio/node_modules ./node_modules

# RUN yarn build

# FROM node:19-alpine as runner
# WORKDIR /my-portofolio
# ENV NODE_ENV production
# # If you are using a custom next.config.js file, uncomment this line.
# COPY --from=builder /my-portofolio/next.config.js ./
# COPY --from=builder /my-portofolio/public ./public
# COPY --from=builder /my-portofolio/.next ./.next
# COPY --from=builder /my-portofolio/node_modules ./node_modules
# COPY --from=builder /my-portofolio/package.json ./package.json


# EXPOSE 3000
# CMD ["yarn", "start"]



# Install dependencies only when needed
FROM node:alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk update && apk add --no-cache libc6-compat && apk add git
WORKDIR /app
COPY package.json yarn.lock ./
RUN --mount=type=cache,target=/root/.yarn YARN_CACHE_FOLDER=/root/.yarn yarn install


# Rebuild the source code only when needed
FROM node:alpine AS builder
# add environment variables to client code
ARG MONGO_URI
ARG BCRYPT_SALT
ARG SENDGRID_API_KEY

RUN export SENDGRID_API_KEY=$(cat /run/secrets/SENDGRID_API_KEY) \
    && export MONGO_URI=$(cat /run/secrets/MONGO_URI) \
    && export BCRYPT_SALT=$(cat /run/secrets/BCRYPT_SALT)


WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
ARG NODE_ENV=production
RUN echo ${NODE_ENV}
RUN NODE_ENV=${NODE_ENV} yarn build

# Production image, copy all the files and run next
FROM node:alpine AS runner
WORKDIR /app
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# You only need to copy next.config.js if you are NOT using the default configuration. 
# Copy all necessary files used by nex.config as well otherwise the build will fail.
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pages ./pages

USER nextjs

# Expose
EXPOSE 3000

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
ENV NEXT_TELEMETRY_DISABLED 1
CMD ["yarn", "start"]