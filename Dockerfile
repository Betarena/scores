# https://hub.docker.com/_/node

# ==== Builder Image
FROM node:16.17.0-alpine as build
WORKDIR /app

# [ℹ] Installs required node packages
COPY package.json package-lock.json ./
# RUN apk add --no-cache git
RUN apk add --no-cache python3=3.11.1-r1 make=4.4-r1 g++=12.2.1_git20220924-r5
RUN npm i --omit=optional

# [ℹ] Builds node application
COPY . .
RUN npm run build

# ==== Final Image
FROM node:16.17.0-alpine
USER node:node
WORKDIR /app

COPY --from=build /app .
COPY . .

EXPOSE 3000
CMD ["node", "./build"]