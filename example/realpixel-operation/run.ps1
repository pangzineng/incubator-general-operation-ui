docker stop gou
docker ps -a -q | % { docker rm $_ }
docker images | ConvertFrom-String | where {$_.P2 -eq "<none>"} | % { docker rmi $_.P3 }

$config = [IO.File]::ReadAllText("example/realpixel-operation/configuration.yaml")
$define = [IO.File]::ReadAllText("example/realpixel-operation/definitions.yaml")

# build with spec
docker build --build-arg SWAGGER_SPEC="$define" --build-arg SWAGGER_UI="$config" --build-arg SWAGGER_ENDPOINT=http://localhost:8888/v1 -t realpixel-operation:0.1.0 .

## run locally
docker run -p 5000:5000  --name gou realpixel-operation:0.1.0
