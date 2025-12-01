#!/bin/sh

log ()
{
  local type=$1
  local strDebugPrefix=$2

  if [ "$type" = "start" ] ; then
    echo -e "$strDebugPrefix ────────────────────────────────────────────────────────────────"
    echo -e "$strDebugPrefix START"
  elif [ "$type" = "end" ] ; then
    echo -e "$strDebugPrefix END"
    echo -e "$strDebugPrefix ────────────────────────────────────────────────────────────────"
  fi
}

docker_cp ()
{
  local src="$1"
  local dest="$2"

  # ╭─────
  # │ NOTE:
  # │ |: the 'dest' path printed by Docker includes the full
  # │ |: absolute path on the host machine, which can be
  # │ |: long and unwieldy. This section cleans it up for
  # │ |: better readability in the logs.
  # ╰─────
  local out
  local size
  local clean_dest

  out=$(docker cp "$src" "$dest" 2>&1)
  size=$(echo "$out" | sed -n 's/Successfully copied \(.*\) to .*/\1/p')
  clean_dest=$(echo "$dest" | sed 's|.*/projects/betarena/apps/||')

  if [ -n "$size" ]; then
    printf "🟩 successfully copied %s to %s\n" "$size" "$clean_dest"
  else
    # fallback: show Docker’s message
    echo "$out"
  fi
}