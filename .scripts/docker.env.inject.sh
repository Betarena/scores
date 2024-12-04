#!/bin/sh

# ╭──────────────────────────────────────────────────────────────────────────────────╮
# │ 📌 High Order Overview                                                           │
# ┣──────────────────────────────────────────────────────────────────────────────────┫
# │ ➤ Code Format   // V.8.0                                                         │
# │ ➤ Status        // 🔒 LOCKED                                                     │
# │ ➤ Author(s)     // @migbash                                                      │
# │ ➤ Maintainer(s) // @migbash                                                      │
# │ ➤ Created on    // 03-12-2024                                                    │
# ┣──────────────────────────────────────────────────────────────────────────────────┫
# │ 📝 Description                                                                   │
# ┣──────────────────────────────────────────────────────────────────────────────────┫
# │ BETARENA (Module)
# │ |: <insert-module-summary-here>
# ╰──────────────────────────────────────────────────────────────────────────────────╯

# set -o allexport
# source ./.env
# set +o allexport

# [🐞]
echo "[docker.env.inject.sh] ENV: " $(env)
# [🐞]
echo "[docker.env.inject.sh] VITE_X_FIREBASE_DB_API_KEY: " $VITE_X_FIREBASE_DB_API_KEY

# ╭─────
# │ NOTE:
# │ |: Loop through all the environment variables that start with 'VITE_X_[..]'
# ╰─────
for i in $(env | grep VITE_X_)
do
  key=$(echo $i | cut -d '=' -f 1)
  value=$(echo $i | cut -d '=' -f 2-)
  # [🐞]
  echo "[docker.env.inject.sh] DYNAMIC ASSIGNING: " $key=$value

  key_original=${key/_X_/}

  export $key_original=$value

  # ╭─────
  # │ NOTE:
  # │ |: This will replace all the occurences of the '$key' in:
  # │ |: [1] All Files (disabled)
  # │ |: [2] All Files with '.js' and '.css' extension
  # ╰─────
  # find /usr/share/nginx/html \
    # -type f \
    # -exec sed -i "s|${key}|${value}|g" '{}' +
  #
  find /app/build \
    -type f \( -name '*.js' -o -name '*.css' \) \
    -exec sed \
    -i "s|${key}|${value}|g" '{}' +
  #
done

# [🐞]
echo "[docker.env.inject.sh] ENV: " $(env)
# [🐞]
echo "[docker.env.inject.sh] Done 🟩"