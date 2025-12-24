#!/usr/bin/env bash
set -euo pipefail

# ANSI escape code for red
RED='\033[0;31m'
NC='\033[0m' # No Color

# Find the container ID of the 'web' service
cid=$(docker ps --filter "name=pingcrm-web" --format "{{.ID}}" | head -n1)

if [ -z "$cid" ]; then
  echo -e "${RED}No running web container found${NC}"
  exit 1
fi

echo "Attaching to web container: $cid"
docker attach "$cid"

