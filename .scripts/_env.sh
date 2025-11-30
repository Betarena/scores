#!/bin/sh

# [🐞]
echo "exporting for environment :: $1"

# ╭──────────────────────────────────────────────────────────────────────────────────╮
# │ 📌 │ DOCKER CONTAINERS                                                           │
# ╰──────────────────────────────────────────────────────────────────────────────────╯

strDockerContainerScores=betarena-scores-scores-production-1
strDockerContainerScoresBuild=betarena-scores-scores-production-build-1
strDockerContainerScoresBuildTemp=betarena-scores-scores-build-temp
strDockerVolumeScores=betarena-scores_scores-production-volume

# ╭──────────────────────────────────────────────────────────────────────────────────╮
# │ 📌 │ HOST PATHS                                                                  │
# ╰──────────────────────────────────────────────────────────────────────────────────╯

strHostDirRuntimeConfig=./.docker/scores.production/runtime.config
strHostDirRuntimeConfigTmp=./.docker/scores.production/.tmp/runtime.config

# ╭──────────────────────────────────────────────────────────────────────────────────╮
# │ 📌 │ DOCKER PATHS                                                                │
# ╰──────────────────────────────────────────────────────────────────────────────────╯

strDockerDirRuntimeConfig=/app/build/runtime.config

# ╭──────────────────────────────────────────────────────────────────────────────────╮
# │ 📌 │ FILENAMES                                                                   │
# ╰──────────────────────────────────────────────────────────────────────────────────╯

strConfigFileName=runtime-config-files.txt
strHostConfigFileClientName=__run-time-config.client.js
strHostConfigFileServerName=__run-time-config.server.js

if [[ "$1" == "staging" ]]; then
  strDockerContainerScores=betarena-scores-scores-staging-1
  strDockerContainerScoresBuild=betarena-scores-scores-staging-build-1
  strDockerVolumeScores=betarena-scores_scores-staging-volume
  strHostDirRuntimeConfig=./.docker/scores.staging/runtime.config
  strHostDirRuntimeConfigTmp=./.docker/scores.staging/.tmp/runtime.config
fi

strOutputHostRuntimeConfigFilePath=$strHostDirRuntimeConfig/$strConfigFileName
strOutputHostPathClient=$strHostDirRuntimeConfig/$strHostConfigFileClientName
strOutputHostPathServer=$strHostDirRuntimeConfig/$strHostConfigFileServerName