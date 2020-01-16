# Introduction

It's a simple web console to perform CURD actions to your standard database (document database works the best)

It's the UI part of the 3 part general data management system
- **ui**: https://github.com/pangzineng/incubator-general-operation-ui
- **gateway**: https://github.com/pangzineng/incubator-general-system-gateway
- **server**: https://github.com/pangzineng/incubator-general-task-distribution-system

# Setup

All you need to do is to set `REACT_APP_AUTH_ENDPOINT` env var before building the app, the endpoint should be whatever address running the gateway

You can grab the default docker image (with endpoint set to `localhost:8080`) from here: https://hub.docker.com/r/pangzineng/incubator-general-operation-ui