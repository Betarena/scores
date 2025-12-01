#!/bin/sh

# ╭──────────────────────────────────────────────────────────────────────────────────╮
# │ 📌 High Order Overview                                                           │
# ┣──────────────────────────────────────────────────────────────────────────────────┫
# │ ➤ Code Format   // V.8.0                                                         │
# │ ➤ Status        // 🔒 LOCKED                                                     │
# │ ➤ Author(s)     // @migbash                                                      │
# │ ➤ Maintainer(s) // @migbash                                                      │
# │ ➤ Created on    // November 17th, 2025                                           │
# ┣──────────────────────────────────────────────────────────────────────────────────┫
# │ 📝 Description                                                                   │
# ┣──────────────────────────────────────────────────────────────────────────────────┫
# │ BETARENA (Module)
# │ |: Update (import) '__run-time-config*.js' configuration files from host-machine to docker-container.
# ╰──────────────────────────────────────────────────────────────────────────────────╯

# #region ➤ 📌 VARIABLES

strDebugPrefix="[docker.runtime-config.update.sh]"

# #endregion ➤ 📌 VARIABLES

#region ➤ 📦 Imports

source ./.scripts/_env.sh $1
source ./.scripts/lib/functions.sh

#endregion ➤ 📦 Imports

checkForChanges ()
{
  if [[ "$3" == "start" ]]; then
    mkdir -p $strHostDirRuntimeConfigTmp
  fi

  # ╭─────
  # │ NOTE:
  # │ |: copy runtime-config files from docker-container to host-machine temporary directory
  # ╰─────
  docker_cp \
    $strDockerContainerScoresBuildTemp:$strDockerRuntimeConfigeConfigFilePath \
    $strHostDirRuntimeConfigTmp/$strConfigFileName
  #
  docker_cp \
    $strDockerContainerScoresBuildTemp:$strDockerPathClient \
    $strHostDirRuntimeConfigTmp/$strConfigFileName
  #
  docker_cp \
    $strDockerContainerScoresBuildTemp:$strDockerPathServer \
    $strHostDirRuntimeConfigTmp/$strConfigFileName
  #

  DIFF_OUTPUT=$(diff -qr $1 $2)

  if [[ -z "$DIFF_OUTPUT" ]]; then
    echo -e "$strDebugPrefix 🟩 no differences found"
  elif [[ -n "$DIFF_OUTPUT" ]]; then
    IFS=$'\n'
    for line in $DIFF_OUTPUT; do
      if [[ "$line" == Only* && "$line" == *"$1"* ]]; then
        transformed=$(echo "$line" | sed -E 's/^Only in ([^:]*): (.*)$/File \2/')
        echo -e "$strDebugPrefix 🟡 runtime only :: $transformed"
      # elif [[ "$line" == Only* && "$line" == *"$2"* ]]; then
        # transformed=$(echo "$line" | sed -E 's/^Only in ([^:]*): (.*)$/File \2/')
        # echo "$strDebugPrefix 🔹 volume only :: $transformed"
      elif [[ "$line" == *" differ" ]]; then
        transformed=$(echo "$line" | sed -E 's/^Files ([^ ]*) and ([^ ]*) differ$/File \1 differs/')
        filePath1=$(echo "$line" | awk '{print $2}')
        filePath2=$(echo "$line" | awk '{print $4}')
        echo -e "$strDebugPrefix ⚠️  $transformed"
        diff -u $filePath1 $filePath2
      # else
      #   echo "$strDebugPrefix ❓ $line"
      fi
    done
    unset IFS
  fi

  if [[ "$3" == "end" ]]; then
    rm -rf ./.docker/scores.production/.tmp
  fi
}

# [🐞]
log start $strDebugPrefix

# ╭─────
# │ NOTE:
# │ |: create temporary (time-limited) docker-container to copy 'runtime-config' files into
# ╰─────
docker run \
  --rm --detach \
  --name $strDockerContainerScoresBuildTemp \
  --volume $strDockerVolumeScores:/app/build:rw \
  alpine \
  sleep 30
#

# ╭─────
# │ NOTE:
# │ |: check for changes between the static directory AND the docker container build files
# │ |: START
# ╰─────
checkForChanges \
  $strHostDirRuntimeConfig \
  $strHostDirRuntimeConfigTmp \
  start
#

# ╭─────
# │ NOTE:
# │ |: loop through runtime-config defined in 'runtime-config-files.txt',
# │ |: and copy (import) each file from (1) host-machine to (2) docker-container
# ╰─────
for i in $(cat $strOutputHostRuntimeConfigFilePath); do
  # [🐞]
  echo -e "$strDebugPrefix 🟧 updating file :: $i"
  if [[ "$i" == *"/client/"* ]]; then
    docker_cp \
      $strOutputHostPathClient \
      $strDockerContainerScoresBuildTemp:"/app/$i"
    #
    docker_cp \
      $strOutputHostPathClient \
      $strDockerContainerScoresBuildTemp:"$strDockerDirRuntimeConfig/__run-time-config.client.js"
    #
    docker_cp \
      $strOutputHostPathClient \
      $strDockerContainerScoresBuildTemp:"/app/build/client/__run-time-config.client.js"
    #
  elif [[ "$i" == *"/server/"* ]]; then
    docker_cp \
      $strOutputHostPathServer \
      $strDockerContainerScoresBuildTemp:"/app/$i"
    #
    docker_cp \
      $strOutputHostPathServer \
      $strDockerContainerScoresBuildTemp:"$strDockerDirRuntimeConfig/__run-time-config.server.js"
    #
    docker_cp \
      $strOutputHostPathServer \
      $strDockerContainerScoresBuildTemp:"/app/build/client/__run-time-config.server.js"
    #
  fi
done

# ╭─────
# │ NOTE:
# │ |: check for changes between the static directory AND the docker container build files
# │ |: END
# ╰─────
checkForChanges \
  $strHostDirRuntimeConfig \
  $strHostDirRuntimeConfigTmp \
  end
#

# [🐞]
log end $strDebugPrefix
