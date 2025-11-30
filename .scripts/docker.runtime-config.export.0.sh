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
# │ |: Aggregate list of '__run-time-config*.js' configuration files in 'build' directory.
# ╰──────────────────────────────────────────────────────────────────────────────────╯

#region ➤ 📌 VARIABLES

strDebugPrefix="[docker.runtime-config.export.0.sh]"
strPathConfigFile=/app/build/runtime.config
strPathBuildFile=/app/build-files.txt

#endregion ➤ 📌 VARIABLES

#region ➤ 📦 Imports

source ./.scripts/lib/functions.sh

#endregion ➤ 📦 Imports

# [🐞]
log start

mkdir -p $strPathConfigFile

# ╭─────
# │ NOTE:
# │ |: find '__run-time-config*.js' files in the 'build' directory.
# ╰─────
find build \
  -type f \
  -name '__run-time-config*.js' \
  > $strPathConfigFile/runtime-config-files.txt
#

# [🐞]
cat $strPathConfigFile/runtime-config-files.txt

# ╭─────
# │ NOTE:
# │ |: loop through '/app/runtime-config-files.txt' file,
# │ |: and copy files to 'build/client' directory with proper names.
# ╰─────
for i in $(cat $strPathConfigFile/runtime-config-files.txt); do
  if [[ "$i" == *"/client/"* ]]; then
    cp $i /app/build/client/__run-time-config.client.js
    cp $i /app/build/runtime.config/__run-time-config.client.js
    cp $i /app/build/runtime.config/__run-time-config.client.original.js
  elif [[ "$i" == *"/server/"* ]]; then
    cp $i /app/build/client/__run-time-config.server.js
    cp $i /app/build/runtime.config/__run-time-config.server.js
    cp $i /app/build/runtime.config/__run-time-config.server.original.js
  fi
done

# ╭─────
# │ NOTE:
# │ |: find '*' (all) files in the 'build' directory.
# ╰─────
find build \
  -type f \
  > $strPathBuildFile
#

# [🐞]
log end