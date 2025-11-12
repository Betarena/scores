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
# │ |: Injects the environment variables into the VITE build files,
# │ |: by replacing the 'VITE_X_' with 'VITE_'.
# │ |: This is done to ensure that the environment variables are available in the
# │ |: production build, and that the 'VITE_' variables are not exposed.
# │ |: The script is executed during the 'docker build' process.
# ╰──────────────────────────────────────────────────────────────────────────────────╯

dockerContainer=betarena-scores-scores-staging-1
dockerRuntimeConfigFilePath=./.docker/scores.staging/runtime-config-files.txt
outputDirClient=./.docker/scores.staging/__run-time-config.client.js
outputDirServer=./.docker/scores.staging/__run-time-config.server.js

# ╭─────
# │ NOTE:
# │ |: loop through all the files listed in the runtime-config-files.txt
# ╰─────
for i in $(cat $dockerRuntimeConfigFilePath); do
  echo "🟧 UPDATING: $i"
  if [[ "$i" == *"/client/"* ]]; then
    # echo "it contains /client/"
    docker cp \
      $outputDirClient \
      $dockerContainer:"/app/$i"
    #
  fi
  if [[ "$i" == *"/server/"* ]]; then
    # echo "it contains /server/"
    docker cp \
      $outputDirServer \
      $dockerContainer:"/app/$i"
    #
  fi
done
