#!/bin/sh

echo "Removing Casimir application containers ..."
docker rm traefik substrate-node web-server web-client storage zookeeper kafka kafka-ui event-proxy web-wallet web-wallet-server -f
echo "Removing Casimir application volumes ..."
# Do not delete letsencrypt volume to preserve certificates 
docker volume rm chainstorage offchainstorage filestorage logstorage zookeeper_data kafka_data -f
echo "Casimir application containers and volumes removed !"