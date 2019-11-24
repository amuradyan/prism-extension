#!/bin/sh

# YADW: We want to skip one of two identical events from inotifywait.
# Could be a WSL issue
CONSUME_EVENT=true

inotifywait -m -e modify -r . @./build/ @./node_modules/ | while read watched_file events event_file
do
  # YADW: We want to exclude .git as well but cant feed it to inotifywait
  if [ $CONSUME_EVENT = true ] && [ $event_file != ".git" ] 
  then
    ./build.sh
    CONSUME_EVENT=false
  else
    CONSUME_EVENT=true
  fi
done