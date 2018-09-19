#!/bin/bash
CONTAINER=${1:-gou-realpixel-operation}
VERSION=${2:-0.1.0}

# build with spec
definitions=$(<definitions.yaml)
configuration=$(<configuration.yaml)
docker build \
  -t ${CONTAINER}:${VERSION} \
  --build-arg SWAGGER_SPEC="${definitions}" \
  --build-arg SWAGGER_UI="${configuration}" \
  --build-arg SWAGGER_ENDPOINT=http://localhost:8888/v1 \
  ../../ &&

# run locally
docker run \
  -d \
  -p 3000:5000 \
  --name ${CONTAINER} \
  ${CONTAINER}:${VERSION}
docker logs -f ${CONTAINER}
