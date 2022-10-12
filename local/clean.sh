#!/bin/sh

IS_DEV="$1"

if [ $IS_DEV  -eq  1 ]
then
  echo "Removing Casimir application containers for DEV environment ..."
  docker rm traefik deip-substrate-node cas-nft-marketplace-storage zookeeper kafka kafka-ui deip-event-proxy deip-web-wallet-client deip-web-wallet-server -f
else
  echo "Removing Casimir application containers ..."
  docker rm traefik deip-substrate-node cas-nft-marketplace-web-server cas-nft-marketplace-web-client cas-nft-marketplace-storage zookeeper kafka kafka-ui deip-event-proxy deip-web-wallet-client deip-web-wallet-server -f
fi

echo "Removing Casimir application volumes ..."
docker volume rm cas_nft_marketplace_chain_storage cas_nft_marketplace_offchain_storage cas_nft_marketplace_file_storage cas_nft_marketplace_log_storage cas_nft_marketplace_zookeeper_storage cas_nft_marketplace_kafka_storage -f
echo "Removing Casimir application network ..."
docker network rm cas_nft_marketplace_network
echo "Casimir application containers, volumes and network removed !"