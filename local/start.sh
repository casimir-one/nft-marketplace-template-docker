#!/bin/sh

DEV_MODE="$1"

echo "Creating application network ..."
docker network create cas_nft_marketplace_network

echo "Creating application volumes ..."
docker volume create --name=cas_nft_marketplace_chain_storage \
&& docker volume create --name=cas_nft_marketplace_offchain_storage \
&& docker volume create --name=cas_nft_marketplace_file_storage \
&& docker volume create --name=cas_nft_marketplace_log_storage \
&& docker volume create --name=cas_nft_marketplace_zookeeper_storage \
&& docker volume create --name=cas_nft_marketplace_kafka_storage

if [ $DEV_MODE  -eq  1 ]
then
  echo "Starting application containers for Casimir backend and frontend development ..."
  docker-compose -f ./local/local.docker-compose.yml up -d --force-recreate \
  traefik \
  deip-substrate-node \
  deip-event-proxy \
  cas-nft-marketplace-storage \
  zookeeper \
  kafka \
  kafka-ui \
  deip-web-wallet-client \
  deip-web-wallet-server
elif [ $DEV_MODE  -eq  2 ]
then
  echo "Starting application containers for Casimir frontend development ..."
  docker-compose -f ./local/local.docker-compose.yml up -d --force-recreate \
  traefik \
  deip-substrate-node \
  deip-event-proxy \
  cas-nft-marketplace-web-server \
  cas-nft-marketplace-storage \
  zookeeper \
  kafka \
  kafka-ui \
  deip-web-wallet-client \
  deip-web-wallet-server
else
  echo "Starting all application containers in local environment ..."
  docker-compose -f ./local/local.docker-compose.yml up -d --force-recreate \
  traefik \
  deip-substrate-node \
  deip-event-proxy \
  cas-nft-marketplace-web-client \
  cas-nft-marketplace-web-server \
  cas-nft-marketplace-storage \
  zookeeper \
  kafka \
  kafka-ui \
  deip-web-wallet-client \
  deip-web-wallet-server
fi

echo "Waiting for Casimir application containers to start ..."
cd ./presetup && sleep 3
echo "Installing npm packages for a setup script ..."
npm install
echo "Running the setup script application ..."
npm run setup
echo "Casimir application containers started !"