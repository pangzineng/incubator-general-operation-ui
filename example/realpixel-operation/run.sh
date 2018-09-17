#!/bin/bash

# build with spec
definitions=$(<definitions.yaml)
configuration=$(<configuration.yaml)
docker build \
  -t realpixel-operation:0.1.0 \
  --build-arg SWAGGER_SPEC="${definitions}" \
  --build-arg SWAGGER_UI="${configuration}" \
  --build-arg SWAGGER_ENDPOINT=http://localhost:8888/v1 \
  ../../ &&

# run locally
docker run \
  -p 3000:5000 \
  realpixel-operation:0.1.0
