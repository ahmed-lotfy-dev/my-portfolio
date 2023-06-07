# Install dependencies only when needed
##    DEPS INSTALL STEP

FROM  node:alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
# RUN apk update && apk add --no-cache libc6-compat && apk add git && apk add nano 
WORKDIR /app


# Install dependencies based on the preferred package manager

COPY package.json package-lock.json ./
COPY ./prisma ./prisma
RUN npm install


##    BUILDER STEP
FROM  node:alpine  AS builder

WORKDIR /app

COPY --from=deps /app/package.json /app/package-lock.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma

# add environment variables to client code
ARG GOOGLE_CLIENT_ID
ARG GOOGLE_CLIENT_SECRET
ARG GITHUB_ID
ARG GITHUB_SECRET
ARG SENDGRID_API_KEY
ARG DATABASE_URL
ARG NEXTAUTH_SECRET
ARG SECRET
ARG NEXTAUTH_URL

ENV GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
ENV GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
ENV ID_GITHUB=${ID_GITHUB}
ENV SECRET_GITHUB=${SECRET_GITHUB}
ENV SENDGRID_API_KEY=${SENDGRID_API_KEY}
ENV DATABASE_URL=${DATABASE_URL}
ENV NEXTAUTH_URL=${NEXTAUTH_URL}
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
ENV SECRET=${SECRET}


RUN echo -e "GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID"> ./.env
RUN echo -e "GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET"> ./.env
RUN echo -e "ID_GITHUB=$ID_GITHUB"> ./.env
RUN echo -e "SECRET_GITHUB=$SECRET_GITHUB"> ./.env
RUN echo -e "SENDGRID_API_KEY=$SENDGRID_API_KEY"> ./.env
RUN echo -e "DATABASE_URL=$DATABASE_URL"> ./.env
RUN echo -e "NEXTAUTH_SECRET=$NEXTAUTH_SECRET"> ./.env
RUN echo -e "NEXTAUTH_URL=$NEXTAUTH_URL"> ./.env
RUN echo -e "SECRET=$SECRET"> ./.env

RUN echo -e "GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID\n GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET\n  ID_GITHUB=$ID_GITHUB_\n SECRET_GITHUB=$SECRET_GITHUB\n SENDGRID_API_KEY=$SENDGRID_API_KEY\n DATABASE_URL=$DATABASE_URL\n NEXTAUTH_URL=$NEXTAUTH_URL\n NEXTAUTH_SECRET=$NEXTAUTH_SECRET\n SECRET=$SECRET"> ./.env

COPY . .
RUN npx prisma generate
RUN npx prisma db push
RUN npm run build

##    RUNNER STEP

# Production image, copy all the files and run next
FROM  node:alpine AS runner
WORKDIR /app


ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs


# You only need to copy next.config.js if you are NOT using the default configuration. 
# Copy all necessary files used by nex.config as well otherwise the build will fail.

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/ ./app
COPY --from=builder /app/.env  ./
COPY --from=builder /app/.env ./.env.production
COPY --from=builder /app/.env ./.env.local


USER nextjs

# Expose
EXPOSE 3000

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
ENV NEXT_TELEMETRY_DISABLED 1
CMD ["npm", "start"]
