#!/bin/bash

DEBUG=false
WATCH=false
FILE_PATH=""

# Loop through arguments to set flags and file path
for arg in "$@"
do
  case $arg in
    --debug)
      DEBUG=true
      shift # Remove --debug from arguments
      ;;
    --watch)
      WATCH=true
      shift # Remove --watch from arguments
      ;;
    *)
      FILE_PATH="$arg" # Assume the remaining argument is the file path
      shift
      ;;
  esac
done

# Set the base command based on the debug and watch flags
if [ "$DEBUG" = true ]; then
  CMD="iex -S mix"
else
  CMD="mix"
fi

if [ "$WATCH" = true ]; then
  CMD="$CMD test.watch"
else
  CMD="$CMD test"
fi

# Execute the command with the file path if provided
if [ "$FILE_PATH" ]; then
  docker compose exec web $CMD "$FILE_PATH"
else
  docker compose exec web $CMD
fi
