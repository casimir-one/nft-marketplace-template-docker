#!/bin/sh

echo "Removing Casimir application containers ..."
docker rm traefik deip-substrate-node cas-nft-marketplace-web-server cas-nft-marketplace-web-client cas-nft-marketplace-storage zookeeper kafka kafka-ui deip-event-proxy deip-web-wallet-client deip-web-wallet-server -f
echo "Removing Casimir application volumes ..."
# Do not delete letsencrypt volume to preserve certificates 
docker volume rm cas_nft_marketplace_chain_storage cas_nft_marketplace_offchain_storage cas_nft_marketplace_file_storage cas_nft_marketplace_log_storage cas_nft_marketplace_zookeeper_storage cas_nft_marketplace_kafka_storage -f
echo "Removing Casimir application network ..."
docker network rm cas_nft_marketplace_network
echo "Casimir application containers, volumes and network removed !"
