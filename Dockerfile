# Dockerfile

# base image
## if the dockr image will run on oracle linux 8 or any arm64 based distro server
FROM --platform=arm64 node:19-alpine3.15 AS node 
## if the dockr image will run on oracle linux 8 or any amd64 based distro server
# FROM --platform=linux/amd64 node:19-alpine3.15 AS node

# create & set working directory
RUN mkdir -p /app/src
WORKDIR /app/src

# copy source files
COPY . /app/src

# install dependencies
RUN npm install

# start app
RUN npm run build
EXPOSE 3000
CMD npm run start