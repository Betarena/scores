# https://hub.docker.com/_/node
# FROM node:14.17-alpine
FROM node:14.17.4

WORKDIR /app
COPY package.json package-lock.json ./

# RUN apk add --no-cache git

RUN npm i --no-optional

COPY . .

RUN npm run build

# https://hub.docker.com/_/node
# FROM node:14.17-slim
FROM node:14.17.4

WORKDIR /app
COPY --from=0 /app .
COPY . .

EXPOSE 3000
CMD ["node", "./build"]