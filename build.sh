#!/bin/bash

# https://161.117.112.139/gsg
export REACT_APP_AUTH_ENDPOINT=${1:-http://localhost:8080}

npm run build --production

rm -rf build/static/js/*.map
rm -rf build/static/css/*.map

