FROM node:19-alpine as dependencies
WORKDIR /my-portofolio
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM node:19-alpine as builder
WORKDIR /my-portofolio
COPY . .
COPY --from=dependencies /my-portofolio/node_modules ./node_modules
RUN --mount=type=secret,id=MONGO_URI \
  --mount=type=secret,id=SENDGRID_API_KEY \
  --mount=type=secret,id=BCRYPT_SALT \
   export MONGO_URI=$(cat /run/secrets/MONGO_URI) && \
   export SENDGRID_API_KEY=$(cat /run/secrets/SENDGRID_API_KEY) && \
   export BCRYPT_SALT=$(cat /run/secrets/BCRYPT_SALT) && \
RUN yarn build

FROM node:19-alpine as runner
WORKDIR /my-portofolio
ENV NODE_ENV production
# If you are using a custom next.config.js file, uncomment this line.
COPY --from=builder /my-portofolio/next.config.js ./
COPY --from=builder /my-portofolio/public ./public
COPY --from=builder /my-portofolio/.next ./.next
COPY --from=builder /my-portofolio/node_modules ./node_modules
COPY --from=builder /my-portofolio/package.json ./package.json


EXPOSE 3000
CMD ["yarn", "start"]
