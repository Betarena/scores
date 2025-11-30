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
# │ |: Copy (export) '__run-time-config*.js' configuration files from docker-container to host-machine.
# ╰──────────────────────────────────────────────────────────────────────────────────╯

#region ➤ 📌 VARIABLES

strDebugPrefix="[docker.runtime-config.export.1.sh]"

#endregion ➤ 📌 VARIABLES

#region ➤ 📦 Imports

source ./.scripts/_env.sh $1
source ./.scripts/lib/functions.sh

#endregion ➤ 📦 Imports

# [🐞]
log start $strDebugPrefix

# ╭─────
# │ NOTE:
# │ |: create a temporary docker container to copy runtime-config files into
# ╰─────
docker run \
  --rm --detach \
  --name $strDockerContainerScoresBuildTemp \
  --volume $strDockerScoresBuildVolume:/app/build:rw \
  alpine \
  sleep 30
#

# ╭─────
# │ NOTE:
# │ |: copy (export) 'runtime-config-files.txt' from (1) docker-container to (2) host-machine
# ╰─────
docker cp \
  $strDockerContainerScoresBuildTemp:$strDockerDirRuntimeConfig/runtime-config-files.txt \
  $strOutputHostRuntimeConfigFilePath
#

# ╭─────
# │ NOTE:
# │ |: loop through 'runtime-config-files.txt' file,
# │ |: AND copy (export) each listed file from (1) docker-container to (2) host-machine
# ╰─────
for i in $(cat $strOutputHostRuntimeConfigFilePath); do
  if [[ "$i" == *"/client/"* ]]; then
    docker cp \
      $strDockerContainerScoresBuildTemp:"/app/$i" \
      $strOutputHostPathClient
    #
  elif [[ "$i" == *"/server/"* ]]; then
     docker cp \
      $strDockerContainerScoresBuildTemp:"/app/$i" \
      $strOutputHostPathServer
    #
  fi
done

# [🐞]
log end $strDebugPrefix