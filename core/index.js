module.exports = {
  BaseClient: require('./ledgerclient'),
  HealthClient: require('./healthclient'),
  Config: {
    Local: {
      channel: "mychannel",
      orderers: [
        "grpc://localhost:7050"
      ],
      peers: [
        "grpc://localhost:7051"
      ],
      hubs: [
        "grpc://localhost:7053"
      ]
    },
    Azure: {
      channel: "mychannel",
      orderers: [
        "grpc://health-ledger.westeurope.cloudapp.azure.com:7050"
      ],
      peers: [
        "grpc://health-ledger.westeurope.cloudapp.azure.com:7051"
      ],
      hubs: [
        "grpc://health-ledger.westeurope.cloudapp.azure.com:7053"
      ]
    }
  }
}
