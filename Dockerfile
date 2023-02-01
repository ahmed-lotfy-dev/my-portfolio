FROM node:lts as dependencies
WORKDIR /app
RUN npm i -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install
COPY /root/.local/share/pnpm/store/v3 /root/.local/share/pnpm/store/v3


FROM node:lts as builder
WORKDIR /app
COPY . .
COPY --from=dependencies /root/.local/share/pnpm/store/v3 /root/.local/share/pnpm/store/v3
COPY --from=dependencies /app/node_modules ./node_modules
RUN npm i -g pnpm

RUN pnpm build

FROM node:lts as runner
RUN npm i -g pnpm
WORKDIR /app
ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["pnpm", "start"]