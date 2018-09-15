#!/bin/bash

# build with spec
docker build \
  --build-arg SWAGGER_SPEC=$(<definitions.yaml) \
  --build-arg SWAGGER_UI=$(<configuration.yaml) \
  --build-arg SWAGGER_ENDPOINT=http://localhost:8888/v1 \
  -t realpixel-operation:0.1.0 \
  ../

# run locally
docker run \
  -p 5000:5000 \
  realpixel-operation:0.1.0