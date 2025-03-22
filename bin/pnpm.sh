#!/bin/bash

# Usage: ./run-pnpm.sh <pnpm_command> [flags]
# Example: ./run-pnpm.sh install
# Example: ./run-pnpm.sh add some-package --save-dev

# Check if there are any arguments passed
if [ $# -eq 0 ]; then
  echo "Usage: $0 <pnpm_command> [flags]"
  exit 1
fi

COMMAND="cd /pingcrm/assets && pnpm $@"
docker-compose exec web sh -c "$COMMAND"
