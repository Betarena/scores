#!/bin/sh

# ╭──────────────────────────────────────────────────────────────────────────────────╮
# │ 📌 High Order Overview                                                           │
# ┣──────────────────────────────────────────────────────────────────────────────────┫
# │ ➤ Code Format   // V.8.0                                                         │
# │ ➤ Status        // 🔒 LOCKED                                                     │
# │ ➤ Author(s)     // @migbash                                                      │
# │ ➤ Maintainer(s) // @migbash                                                      │
# │ ➤ Created on    // December 12th, 2024                                           │
# ┣──────────────────────────────────────────────────────────────────────────────────┫
# │ 📝 Description                                                                   │
# ┣──────────────────────────────────────────────────────────────────────────────────┫
# │ BETARENA (Module)
# │ |: Injects the environment variables into the VITE build files,
# │ |:  by replacing the 'VITE_X_' with 'VITE_'.
# │ |: This is done to ensure that the environment variables are available in the
# │ |:  production build, and that the 'VITE_' variables are not exposed.
# │ |: The script is executed during the 'docker build' process.
# ╰──────────────────────────────────────────────────────────────────────────────────╯

# set -o allexport
# source ./env/.env.docker.scores
# set +o allexport

strDebugPrefix="[docker.scores.build.env.inject.sh]"

# [🐞]
echo "$strDebugPrefix ────────────────────────────────────────────────────────────────"
# [🐞]
# echo "$strDebugPrefix ENV:" $(env)

# [🐞]
echo "$strDebugPrefix 'VITE_X_' values remaining (build) ::" $(find build -type f -exec grep -i "VITE_X" {} \; | wc -l)
# [🐞]
echo "$strDebugPrefix 'VITE_X_' values remaining (build.copy) ::" $(find build.copy -type f -exec grep -i "VITE_X" {} \; | wc -l)
# [🐞]
echo "$strDebugPrefix ────────────────────────────────────────────────────────────────"

# ╭─────
# │ NOTE:
# │ |: loop through all the environment variables that start with 'VITE_X_[..]'
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
  echo "$strDebugPrefix assingement $key = $value"

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
  # │ |: [2] All Files with '.js,.css' extension. Ignore '.txt' and '.xml' files as these are mounted and don't contain secret values.
  # ┣─────
  # │ https://www.unix.com/shell-programming-and-scripting/268208-problems-ampersand-sed-command.html
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
    -name '*.js' \
    -exec sed -i "s|${key}|${value_adjusted}|g" '{}' +
    # -exec sh -c 'tmp=$(mktemp); sed "s|'"${key}"'|'"${value_adjusted}"'|g" "$1" > "$tmp"; cat "$tmp" > "$1"; rm "$tmp"' sh {} \;
  #

  counter=$((counter+1))
done

# [🐞]
echo "$strDebugPrefix ────────────────────────────────────────────────────────────────"
# [🐞]
echo "$strDebugPrefix 'VITE_X_' values remaining (build) ::" $(find build -type f -exec grep -i "VITE_X" {} \; | wc -l)
# [🐞]
echo "$strDebugPrefix 'VITE_X_' values replaced ::" $counter
# [🐞]
echo "$strDebugPrefix // END"
# [🐞]
# echo "$strDebugPrefix ENV:" $(env)