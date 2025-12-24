#!/bin/bash
set -euo pipefail


PORT=4004
HOST=localhost
SCHEME=http
HOST_UPLOADS_DIR="$(pwd)/priv/test_prod_uploads"
TARGET_UPLOADS_DIR=/var/lib/pingcrm/uploads
UPLOADS_VOLUME="$HOST_UPLOADS_DIR:$TARGET_UPLOADS_DIR"

docker run \
  --env-file ./docker/.env.prod-test \
  --network pingcrm_network \
  \
  -e UPLOADS_DIR=$TARGET_UPLOADS_DIR \
  -v $UPLOADS_VOLUME \
  -e ASSETS_HOST=$SCHEME://$HOST:$PORT/uploads \
  \
  -e PHX_HOST=$HOST \
  -e PHX_SCHEME=$SCHEME \
  -e PORT=$PORT \
  -p $PORT:$PORT \
  pingcrm

