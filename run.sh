#!/bin/bash

if [ "$EUID" -ne 0 ]
  then echo "Please run as root"
  exit
fi

TEAMID=`md5sum README.md | cut -d' ' -f 1`
docker kill $(docker ps -a -q) #Kill all containers
docker rm $(docker ps -a -q) #Remove all dead containers
docker-compose build #Rebuild the composed containers, just in case
docker-compose up #Raise the containers
#build . -t $TEAMID
#docker run -p 80:80 -p 8080:8080 -t $TEAMID
