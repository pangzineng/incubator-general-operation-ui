#!/bin/bash
CONTAINER=${1:-gou-previewreality-operation}
VERSION=${2:-0.1.0}

# build with spec
definitions=$(<definitions.yaml)
configuration=$(<configuration.yaml)
export REACT_APP_SWAGGER_SPEC="${definitions}"
export REACT_APP_SWAGGER_UI="${configuration}"
export REACT_APP_SWAGGER_ENDPOINT=http://localhost:8888/v1

npm --prefix ../../ install &&
npm --prefix ../../ start