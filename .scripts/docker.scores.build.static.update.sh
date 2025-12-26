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
# │ |: Update static files in docker-container from host-machine static directory in docker-volume.
# ╰──────────────────────────────────────────────────────────────────────────────────╯

#region ➤ 📌 VARIABLES

strDebugPrefix="[docker.scores.build.static.update.sh]"

#endregion ➤ 📌 VARIABLES

#region ➤ 📦 Imports

source ./.scripts/_env.sh $1
source ./.scripts/lib/functions.sh

#endregion ➤ 📦 Imports

checkForChanges ()
{
  if [[ "$3" == "start" ]]; then
    mkdir -p $strHostDirScores/.tmp
    docker_cp \
      $strDockerContainerScoresBuildTemp:/app/build \
      $strHostDirScores/.tmp
    #
  fi

  DIFF_OUTPUT=$(diff -qr $1 $2)

  if [[ -z "$DIFF_OUTPUT" ]]; then
    # [🐞]
    echo -e "$strDebugPrefix 🟩 no differences found"
  elif [[ -n "$DIFF_OUTPUT" ]]; then
    IFS=$'\n'
    for line in $DIFF_OUTPUT; do
      if [[ "$line" == Only* && "$line" == *"$1"* ]]; then
        transformed=$(echo "$line" | sed -E 's/^Only in ([^:]*): (.*)$/File \2/')
        # [🐞]
        echo -e "$strDebugPrefix 🟡 runtime only :: $transformed"
      # elif [[ "$line" == Only* && "$line" == *"$2"* ]]; then
        # transformed=$(echo "$line" | sed -E 's/^Only in ([^:]*): (.*)$/File \2/')
        # echo "$strDebugPrefix 🔹 volume only :: $transformed"
      elif [[ "$line" == *" differ" ]]; then
        transformed=$(echo "$line" | sed -E 's/^Files ([^ ]*) and ([^ ]*) differ$/File \1 differs/')
        # [🐞]
        echo -e "$strDebugPrefix ⚠️  $transformed"
      # else
      #   echo "$strDebugPrefix ❓ $line"
      fi
    done
    unset IFS
  fi

  if [[ "$3" == "end" ]]; then
    rm -rf $strHostDirScores/.tmp
  fi
}

# [🐞]
log start $strDebugPrefix

# ╭─────
# │ CHECK:
# │ |: ensure that 'static.override.files.txt' exists
# ╰─────
if [[ -f $strStaticOverrideFilePath ]]; then
  # [🐞]
  echo "$strDebugPrefix 🟢 found static override file :: $strStaticOverrideFilePath"
else
  # [🐞]
  echo "$strDebugPrefix 🔴 static override file NOT found :: $strStaticOverrideFilePath"
  exit 0
fi

# ╭─────
# │ NOTE:
# │ |: create a temporary docker container to copy static files into
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
  $strHostDirStatic \
  $strHostDirScores/.tmp/build/client \
  start
#

# ╭─────
# │ NOTE:
# │ |: loop through ALL files in the static directory and copy them into the
# │ |: running docker container, preserving the directory structure.
# ╰─────
for strFilePath in $(find $strHostDirStatic -type f); do
  # ╭─────
  # │ NOTE:
  # │ |: skip files that are NOT listed in 'static.files.override.txt'
  # ╰─────
  counter=0
  for i in $(cat $strStaticOverrideFilePath); do
    if [[ "$strFilePath" == *"$i"* ]]; then
      counter=1
    fi
  done
  if [[ $counter -eq 0 ]]; then
    # [🐞]
    echo -e "$strDebugPrefix 🟦 skipping override file :: $strFilePath"
    continue
  fi

  # [🐞]
  echo -e "$strDebugPrefix 🔹 processing :: $strFilePath"
  strFilePathInsideContainer="${strFilePath/$strHostDirScores\/static/\/build\/client}"
  # [🐞]
  echo -e "$strDebugPrefix 💽 persisting :: $strFilePathInsideContainer"
  docker exec \
    $strDockerContainerScoresBuildTemp mkdir -p "$(dirname /app/$strFilePathInsideContainer)"
  #
  docker_cp \
    $strFilePath \
    $strDockerContainerScoresBuildTemp:"/app/$strFilePathInsideContainer"
  #
done

# ╭─────
# │ NOTE:
# │ |: check for changes between the static directory AND the docker container build files
# │ |: END
# ╰─────
checkForChanges \
  $strHostDirStatic \
  $strHostDirScores/.tmp/build/client \
  end
#

# [🐞]
log end $strDebugPrefix