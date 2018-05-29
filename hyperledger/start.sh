#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
# Exit on first error, print all commands.
set -ev

# don't rewrite paths for Windows Git Bash users
export MSYS_NO_PATHCONV=1

docker-compose -f docker-compose.yml down

docker-compose -f docker-compose.yml up -d orderer.health-ledger.de peer0.mainorg.health-ledger.de couchdb

# wait for Hyperledger Fabric to start
export FABRIC_START_TIMEOUT=10
sleep ${FABRIC_START_TIMEOUT}


# Now launch the CLI container in order to create the channel
docker-compose -f ./docker-compose.yml up -d cli

# Create the channel
docker exec cli peer channel create -o orderer.health-ledger.de:7050 -c mychannel -f /etc/hyperledger/config/genesis/channel.tx
docker exec cli peer channel join -b mychannel.block
