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

# [🐞]
echo "[docker.runtime-config.export.0.sh] ────────────────────────────────────────────────────────────────"

configFile=/app/runtime-config-files.txt

# [🐞]
echo "[docker.runtime-config.export.0.sh] EXPORTING RUNTIME CONFIG FILES LIST 🟨 // START"

# ╭─────
# │ NOTE:
# │ |: find '__run-time-config*.js' files in the 'build' directory.
# ╰─────
find build \
  -type f \
  -name '__run-time-config*.js' \
  > $configFile
#

# [🐞]
cat $configFile

# [🐞]
echo "[docker.runtime-config.export.0.sh] EXPORTING RUNTIME CONFIG FILES LIST 🟨 // END"
# [🐞]
echo "[docker.runtime-config.export.0.sh] ────────────────────────────────────────────────────────────────"