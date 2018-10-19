docker stop gou
docker ps -a -q | % { docker rm $_ }
docker images | ConvertFrom-String | where {$_.P2 -eq "<none>"} | % { docker rmi $_.P3 }

# build with spec
docker build --build-arg AUTH_ENDPOINT=http://localhost:8080 -t gou:0.1.0 .

## run locally
docker run -p 5000:5000  --name gou gou:0.1.0
