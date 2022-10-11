#!/bin/sh

echo "Creating appliction volumes ..."
docker volume create --name=chainstorage && docker volume create --name=offchainstorage && docker volume create --name=filestorage && docker volume create --name=logstorage && docker volume create --name=zookeeper_data && docker volume create --name=kafka_data
echo "Starting appliction containers ..."
docker-compose -f ./demo/demo.docker-compose.yml up -d --force-recreate
echo "Waiting for Casimir application containers to start ..."
cd ./presetup && sleep 3
# echo "Installing npm packages for a setup script ..."
# npm install
# echo "Running the setup script application ..."
# npm run setup
echo "Casimir application containers started !"
