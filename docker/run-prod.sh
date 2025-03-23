#!/bin/bash
set -euo pipefail

docker run \
  --env-file ./docker/.env.prod-test \
  --network pingcrm_network \
  -e PORT=4004 \
  -p 4004:4004 \
  pingcrm

