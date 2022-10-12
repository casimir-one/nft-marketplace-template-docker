#!/bin/sh

DEV_MODE="$1"

if [ $DEV_MODE  -eq  1 ]
then
  echo "Removing application containers for Casimir backend and frontend development ..."
  docker rm \
  traefik \
  deip-substrate-node \
  deip-event-proxy \
  cas-nft-marketplace-storage \
  zookeeper \
  kafka \
  kafka-ui \
  deip-web-wallet-client \
  deip-web-wallet-server -f
elif [ $DEV_MODE  -eq  2 ]
then
  echo "Removing application containers for Casimir frontend development ..."
  docker rm \
  traefik \
  deip-substrate-node \
  deip-event-proxy \
  cas-nft-marketplace-web-server \
  cas-nft-marketplace-storage \
  zookeeper \
  kafka \
  kafka-ui \
  deip-web-wallet-client \
  deip-web-wallet-server -f
else
  echo "Removing all application containers in local environment ..."
  docker rm \
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
  deip-web-wallet-server -f
fi

echo "Removing Casimir application volumes ..."
docker volume rm \
cas_nft_marketplace_chain_storage \
cas_nft_marketplace_offchain_storage \
cas_nft_marketplace_file_storage \
cas_nft_marketplace_log_storage \
cas_nft_marketplace_zookeeper_storage \
cas_nft_marketplace_kafka_storage -f

echo "Removing Casimir application network ..."
docker network rm cas_nft_marketplace_network
echo "Casimir application containers, volumes and network removed !"