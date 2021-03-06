'use strict';

const Network = require('health-ledger-network');
var config = {
   channel: "mychannel",
   orderers: [
      "grpc://health-ledger.westeurope.cloudapp.azure.com:7050"
   ],
   peers: [
      "grpc://health-ledger.westeurope.cloudapp.azure.com:7051"
   ],
   hubs: [
      "grpc://health-ledger.westeurope.cloudapp.azure.com:7053"
   ],
   identity: {
      username: "admin",
      mspid: "MainOrgMSP",
      key: "-----BEGIN PRIVATE KEY-----\nMIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQg3nqseyZ8++6YDC9g\nHYqCHHH9UUvc4to5D8OY3apMbPqhRANCAARUJSbr4uyZSYKepEyS29SotbR9kIjA\nThiB3uZwMTY2bE1Ygy/YY10IhZ2fdMcdjxVxOorSQgBVW/qzN5KO8w+C\n-----END PRIVATE KEY-----\n",
      cert: "-----BEGIN CERTIFICATE-----\nMIICGTCCAcGgAwIBAgIQezNXf3zgVA4M3Jj3nL4dDTAKBggqhkjOPQQDAjB4MQsw\nCQYDVQQGEwJERTEMMAoGA1UECBMDTlJXMRIwEAYDVQQHEwlCaWVsZWZlbGQxITAf\nBgNVBAoTGG1haW5vcmcuaGVhbHRoLWxlZGdlci5kZTEkMCIGA1UEAxMbY2EubWFp\nbm9yZy5oZWFsdGgtbGVkZ2VyLmRlMB4XDTE4MDUyOTAwMjIyNFoXDTI4MDUyNjAw\nMjIyNFowWDELMAkGA1UEBhMCREUxDDAKBgNVBAgTA05SVzESMBAGA1UEBxMJQmll\nbGVmZWxkMScwJQYDVQQDDB5BZG1pbkBtYWlub3JnLmhlYWx0aC1sZWRnZXIuZGUw\nWTATBgcqhkjOPQIBBggqhkjOPQMBBwNCAARUJSbr4uyZSYKepEyS29SotbR9kIjA\nThiB3uZwMTY2bE1Ygy/YY10IhZ2fdMcdjxVxOorSQgBVW/qzN5KO8w+Co00wSzAO\nBgNVHQ8BAf8EBAMCB4AwDAYDVR0TAQH/BAIwADArBgNVHSMEJDAigCBm2ARXOoMT\nnj6ujDrQ0pehWt5kgBhEVTWSVsNIlm4AKjAKBggqhkjOPQQDAgNGADBDAh8lxIyp\n1CEhxm8JG0LYdcPCwZazXc2DnVD1bxilZlahAiAJIdymk1p2fNjAwvoPqwg0h+pl\nYNrlwTyWKACMbSHfxQ==\n-----END CERTIFICATE-----\n"
   },
   adminIdentity: {
      mspid: "MainOrgMSP",
      key: "-----BEGIN PRIVATE KEY-----\nMIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQg3nqseyZ8++6YDC9g\nHYqCHHH9UUvc4to5D8OY3apMbPqhRANCAARUJSbr4uyZSYKepEyS29SotbR9kIjA\nThiB3uZwMTY2bE1Ygy/YY10IhZ2fdMcdjxVxOorSQgBVW/qzN5KO8w+C\n-----END PRIVATE KEY-----\n",
      cert: "-----BEGIN CERTIFICATE-----\nMIICGTCCAcGgAwIBAgIQezNXf3zgVA4M3Jj3nL4dDTAKBggqhkjOPQQDAjB4MQsw\nCQYDVQQGEwJERTEMMAoGA1UECBMDTlJXMRIwEAYDVQQHEwlCaWVsZWZlbGQxITAf\nBgNVBAoTGG1haW5vcmcuaGVhbHRoLWxlZGdlci5kZTEkMCIGA1UEAxMbY2EubWFp\nbm9yZy5oZWFsdGgtbGVkZ2VyLmRlMB4XDTE4MDUyOTAwMjIyNFoXDTI4MDUyNjAw\nMjIyNFowWDELMAkGA1UEBhMCREUxDDAKBgNVBAgTA05SVzESMBAGA1UEBxMJQmll\nbGVmZWxkMScwJQYDVQQDDB5BZG1pbkBtYWlub3JnLmhlYWx0aC1sZWRnZXIuZGUw\nWTATBgcqhkjOPQIBBggqhkjOPQMBBwNCAARUJSbr4uyZSYKepEyS29SotbR9kIjA\nThiB3uZwMTY2bE1Ygy/YY10IhZ2fdMcdjxVxOorSQgBVW/qzN5KO8w+Co00wSzAO\nBgNVHQ8BAf8EBAMCB4AwDAYDVR0TAQH/BAIwADArBgNVHSMEJDAigCBm2ARXOoMT\nnj6ujDrQ0pehWt5kgBhEVTWSVsNIlm4AKjAKBggqhkjOPQQDAgNGADBDAh8lxIyp\n1CEhxm8JG0LYdcPCwZazXc2DnVD1bxilZlahAiAJIdymk1p2fNjAwvoPqwg0h+pl\nYNrlwTyWKACMbSHfxQ==\n-----END CERTIFICATE-----\n"
   }
}

async function deploy(path, chaincodeId, version, type) {
  let client = await Network.BaseClient.initFromConfig(config);

  try {
    let response = await client.autoUpgradeChaincode(path, chaincodeId, version, type);
    console.log(response);
  }
  catch(e) {
    console.log(e);
  }
}

var args = process.argv.slice(2);

if(args.length < 3 || args.length > 4){
  console.log("\nUsage: upgrade <path> <name> <version> [type]\n\n")
  return;
}

let path = args[0]
let name = args[1]
let version = args[2];
let type = 'node';

if(args.length > 3)
  type = args[3];

deploy(path, name, version, type)
