#!/bin/bash
CONTAINER=${1:-gou}
VERSION=${2:-0.1.0}

# build with spec
docker build \
  -t ${CONTAINER}:${VERSION} \
  --build-arg AUTH_ENDPOINT=http://localhost:8080 \
  ../../ &&

# run locally
docker stop ${CONTAINER}
docker rm ${CONTAINER}
docker run \
  -d \
  -p 3000:5000 \
  --name ${CONTAINER} \
  ${CONTAINER}:${VERSION}
docker logs -f ${CONTAINER}
