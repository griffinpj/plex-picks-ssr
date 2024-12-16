#!/bin/bash

docker buildx build --platform linux/amd64 -t plexpicks:latest . && docker tag plexpicks:latest cougargriff/plexpicks:latest && docker push cougargriff/plexpicks:latest
