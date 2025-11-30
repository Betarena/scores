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