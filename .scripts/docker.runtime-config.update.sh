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
# ╰──────────────────────────────────────────────────────────────────────────────────╯

strDebugPrefix="[docker.runtime-config.update.sh]"
dockerContainer=betarena-scores-scores-production-1
dockerRuntimeConfigFilePath=./.docker/scores.production/runtime.config/runtime-config-files.txt
outputDirClient=./.docker/scores.production/runtime.config/__run-time-config.client.js
outputDirServer=./.docker/scores.production/runtime.config/__run-time-config.server.js

# [🐞]
echo "$strDebugPrefix ────────────────────────────────────────────────────────────────"
# [🐞]
echo "$strDebugPrefix UPDATE RUNTIME CONFIG FILE TO DOCKER CONTAINER 🟨 // START"

# ╭─────
# │ NOTE:
# │ |: loop through all the files listed in the runtime-config-files.txt, and copy each file from the (1) host-machine to the (2) docker-container
# ╰─────
for i in $(cat $dockerRuntimeConfigFilePath); do
  # [🐞]
  echo "\n$strDebugPrefix 🟧 UPDATING :: $i // INSIGHT"
  if [[ "$i" == *"/client/"* ]]; then
    # [🐞]
    # echo "it contains /client/"
    docker cp \
      $outputDirClient \
      $dockerContainer:"/app/$i"
    #
  fi
  if [[ "$i" == *"/server/"* ]]; then
    # [🐞]
    # echo "it contains /server/"
    docker cp \
      $outputDirServer \
      $dockerContainer:"/app/$i"
    #
  fi
  # [🐞]
  echo ""
done

# [🐞]
echo ""
# [🐞]
echo "$strDebugPrefix UPDATE RUNTIME CONFIG FILE TO DOCKER CONTAINER 🟨 // END"
# [🐞]
echo "$strDebugPrefix ────────────────────────────────────────────────────────────────"
