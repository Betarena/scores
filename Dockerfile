# https://hub.docker.com/_/node

# ==== Builder Image
FROM node:16.17.0-alpine
WORKDIR /app

# [ℹ] Installs required node packages
COPY package.json package-lock.json ./
# RUN apk add --no-cache git
RUN apk add --no-cache python3 make g++
RUN npm i --omit=optional

# [ℹ] Builds node application
COPY . .
RUN npm run build

# ==== Final Image
FROM node:16.17.0-alpine
USER node:node
WORKDIR /app

COPY --from=0 /app .
COPY . .

EXPOSE 3000
CMD ["node", "./build"]