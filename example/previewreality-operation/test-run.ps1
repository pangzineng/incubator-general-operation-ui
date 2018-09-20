$REACT_APP_SWAGGER_UI = [IO.File]::ReadAllText("example/previewreality-operation/configuration.yaml")
$REACT_APP_SWAGGER_SPEC = [IO.File]::ReadAllText("example/previewreality-operation/definitions.yaml")
$REACT_APP_SWAGGER_ENDPOINT = "http://localhost:8888/v1"

npm install
npm start