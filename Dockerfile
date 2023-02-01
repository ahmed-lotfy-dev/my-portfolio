FROM node:lts as dependencies
WORKDIR /app
COPY package.json ./
RUN yarn install


FROM node:lts as builder
WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
ENV NODE_ENV production
EXPOSE 3000
CMD ["yarn", "start"]


