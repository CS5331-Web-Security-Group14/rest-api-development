#!/bin/bash

if [ "$EUID" -ne 0 ]
  then echo "Please run as root"
  exit
fi

TEAMID=`md5sum README.md | cut -d' ' -f 1`
docker kill $(docker ps -a -q)
docker rm $(docker ps -a -q)
docker-compose up 
#build . -t $TEAMID
#docker run -p 80:80 -p 8080:8080 -t $TEAMID
