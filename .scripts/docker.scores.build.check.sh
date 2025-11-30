#!/bin/sh

# ╭──────────────────────────────────────────────────────────────────────────────────╮
# │ 📌 High Order Overview                                                           │
# ┣──────────────────────────────────────────────────────────────────────────────────┫
# │ ➤ Code Format   // V.8.0                                                         │
# │ ➤ Status        // 🔒 LOCKED                                                     │
# │ ➤ Author(s)     // @migbash                                                      │
# │ ➤ Maintainer(s) // @migbash                                                      │
# │ ➤ Created on    // November 26th, 2025.                                          │
# ┣──────────────────────────────────────────────────────────────────────────────────┫
# │ 📝 Description                                                                   │
# ┣──────────────────────────────────────────────────────────────────────────────────┫
# │ BETARENA (Module)
# ╰──────────────────────────────────────────────────────────────────────────────────╯

#region ➤ 📌 VARIABLES

strDebugPrefix="[docker.scores.build.check.sh]"

#endregion ➤ 📌 VARIABLES

#region ➤ 📦 Imports

source ./.scripts/lib/functions.sh

#endregion ➤ 📦 Imports

# [🐞]
log start $strDebugPrefix

# [🐞]
echo "$strDebugPrefix Number of files :: $(ls -R build.copy | wc -l) (./build.copy)"
# [🐞]
echo "$strDebugPrefix Number of files (changed) between build and build.copy ::" $(diff -qr build build.copy | wc -l)
# [🐞]
echo "$strDebugPrefix"

DIFF_OUTPUT=$(diff -qr build build.copy)

if [[ -z "$DIFF_OUTPUT" ]]; then
  echo -e "$strDebugPrefix 🟩  No differences found"
elif [[ -n "$DIFF_OUTPUT" ]]; then
  IFS=$'\n'
  for line in $DIFF_OUTPUT; do
    if [[ "$line" == Only* ]]; then
      echo -e "$strDebugPrefix 💎  $line"
    elif [[ "$line" == *" differ" ]]; then
      transformed=$(echo "$line" | sed -E 's/^Files ([^ ]*) and ([^ ]*) differ$/File \1 differs/')
      echo -e "$strDebugPrefix ⚠️  $transformed"
    else
      echo -e "$strDebugPrefix ❓  $line"
    fi
  done
  unset IFS
fi

# [🐞]
echo "$strDebugPrefix"
# [🐞]
log end $strDebugPrefix