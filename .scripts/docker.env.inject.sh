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
# source ./env/.env.docker.scores
# set +o allexport

# [🐞]
echo "[docker.env.inject.sh] ────────────────────────────────────────────────────────────────"
# [🐞]
# echo "[docker.env.inject.sh] ENV:" $(env)
# [🐞]
echo "[docker.env.inject.sh] ENVIROMENT INJECTION 🟨 // START"

# ╭─────
# │ NOTE:
# │ |: Loop through all the environment variables that start with 'VITE_X_[..]'
# ╰─────
counter=0
for i in $(env | grep VITE_X_)
do
  # ╭─────
  # │ NOTE:
  # │ |: Extract the 'key' and 'value' from the environment variable
  # ╰─────
  key=$(echo $i | cut -d '=' -f 1)
  value=$(echo $i | cut -d '=' -f 2-)
  # [🐞]
  echo "[docker.env.inject.sh] ASSIGN NEW VALUE:" $key = $value

  # ╭─────
  # │ NOTE:
  # │ |: Replace the 'VITE_X_' with 'VITE_' in the global environment variables
  # ╰─────
  key_original=${key/_X_/_}
  export $key_original=$value
  unset $key

  # ╭─────
  # │ NOTE:
  # │ |: Replace ALL occurences of the '$key' in:
  # │ |: [1] (disabled) All Files
  # │ |: [2] All Files with '.js' and '.css' extension
  # ┣─────
  # │ NOTE:
  # │ |: [1] 'gsed' is used instead of 'sed' to support MacOS
  # ╰─────
  value_adjusted=${value/&/\\&}
  # find /usr/share/nginx/html \
    # -type f \
    # -exec sed -i "s|${key}|${value}|g" '{}' +
  #
  find build \
    -type f \
    -exec sed \
    -i "s|${key}|${value_adjusted}|g" '{}' +
  #

  counter=$((counter+1))
done

# [🐞]
echo "[docker.env.inject.sh] ────────────────────────────────────────────────────────────────"
# [🐞]
echo "[docker.env.inject.sh] 'VITE_X_' values remaining" $(find build -type f -exec grep -i "VITE_X" {} + | wc -l)
# [🐞]
echo "[docker.env.inject.sh] 'VITE_X_' values replaced" $counter
# [🐞]
echo "[docker.env.inject.sh] ENVIROMENT INJECTION 🟨 // END"

# [🐞]
# echo "[docker.env.inject.sh] ENV:" $(env)
# [🐞]
echo "[docker.env.inject.sh] DONE 🟩"