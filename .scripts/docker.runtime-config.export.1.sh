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
# │ |: Copy '__run-time-config*.js' configuration files from docker-container to host-machine.
# ╰──────────────────────────────────────────────────────────────────────────────────╯

strDebugPrefix="[docker.runtime-config.export.1.sh]"
dockerContainer=betarena-scores-scores-staging-1
dockerRuntimeConfigFilePath=/app/runtime-config-files.txt
hostRuntimeConfigFilePath=./.docker/scores.staging/runtime-config-files.txt
outputDirClient=./.docker/scores.staging/__run-time-config.client.js
outputDirServer=./.docker/scores.staging/__run-time-config.server.js

# [🐞]
echo "$strDebugPrefix ────────────────────────────────────────────────────────────────"
# [🐞]
echo "$strDebugPrefix EXPORTING RUNTIME CONFIG FILE TO HOST 🟨 // START"

# ╭─────
# │ NOTE:
# │ |: copy 'runtime-config-files.txt' from the (1) docker-container to the (2) host-machine
# ╰─────
docker cp \
  $dockerContainer:$dockerRuntimeConfigFilePath $hostRuntimeConfigFilePath
#

# ╭─────
# │ NOTE:
# │ |: loop through 'runtime-config-files.txt' file
# ╰─────
for i in $(cat $hostRuntimeConfigFilePath); do
  # [🐞]
  echo "\n$strDebugPrefix 📝 $i // INSIGHT"
  if [[ "$i" == *"/client/"* ]]; then
    # echo "it contains /client/"
    docker cp \
      $dockerContainer:"/app/$i" $outputDirClient
    #
  fi
  if [[ "$i" == *"/server/"* ]]; then
    # echo "it contains /server/"
     docker cp \
      $dockerContainer:"/app/$i" $outputDirServer
    #
  fi
done

# [🐞]
echo "$strDebugPrefix EXPORTING RUNTIME CONFIG FILE TO HOST 🟨 // END"
# [🐞]
echo "$strDebugPrefix ────────────────────────────────────────────────────────────────"