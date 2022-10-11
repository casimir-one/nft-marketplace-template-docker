#!/bin/sh

echo "Creating application network ..."
docker network create cas_nft_marketplace_network
echo "Creating application volumes ..."
docker volume create --name=cas_nft_marketplace_chain_storage && docker volume create --name=cas_nft_marketplace_offchain_storage && docker volume create --name=cas_nft_marketplace_file_storage && docker volume create --name=cas_nft_marketplace_log_storage && docker volume create --name=cas_nft_marketplace_zookeeper_storage && docker volume create --name=cas_nft_marketplace_kafka_storage
echo "Starting application containers ..."
docker-compose -f ./local/local.docker-compose.yml up -d --force-recreate
echo "Waiting for Casimir application containers to start ..."
cd ./presetup && sleep 3
echo "Installing npm packages for a setup script ..."
npm install
echo "Running the setup script application ..."
npm run setup
echo "Casimir application containers started !"
