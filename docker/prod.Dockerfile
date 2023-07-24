# https://hub.docker.com/_/node

# ==== Builder Image
FROM node:16.17.0-alpine as build
WORKDIR /app

# [ℹ] Installs required node packages
COPY package.json package-lock.json ./
# RUN apk add --no-cache git
# [ℹ] Installs required APK packages:
# [ℹ] https://pkgs.alpinelinux.org/packages
# [ℹ] example-use: https://superuser.com/questions/1055060/how-to-install-a-specific-package-version-in-alpine
# [ℹ] example-use: https://superuser.com/questions/1198215/fixate-version-alpine-linux-apk-package-in-container
RUN apk add --no-cache \
  python3=3.10.12-r0 \
  make=4.3-r0 \
  g++=11.2.1_git20220219-r2 \
  && npm install -g npm@8.19.1 \
  && npm i --omit=optional

# [ℹ] Builds node application
COPY . .
RUN npm run build

# ********************************************************************
# STEP 2 | Build And Publish                                         *
# ********************************************************************

FROM node:16.17.0-alpine as final
USER node:node
WORKDIR /app

# ********************************************************************
# STEP 3 | TARGET Code Deployment                                    *
# ********************************************************************

COPY --from=build /app .
COPY . .

EXPOSE 5055
# CMD ["node", "./build"]
CMD ["npm", "run", "start:docker"]