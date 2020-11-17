docker run \
    --name postgres \
    -e POSTGRES_USER=grios \
    -e POSTGRES_PASSWORD=password \
    -e POSTGRES_DB=heroes \
    -p 5432:5432 \
    -d \
    postgres

docker ps
docker exec -it postgres /bin/bash

docker run \
    --name adminer \
    -p 8080:8080
    --link postgres:postgres \
    -d \
    adminer

docker exec \
    -it mongodb mongo \
    --host localhost \
    -u admin -p admin \
    --authenticationDatabase admin \
    --eval "db.getSiblingDB('herois').createUser({user: 'grios', pwd: 'secreta', roles: [{role: 'readWrite', db: 'herois'}]})"