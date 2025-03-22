#!/bin/bash
set -euo pipefail

docker build \
  -f docker/Dockerfile \
  --target=release \
  -t pingcrm \
  .
