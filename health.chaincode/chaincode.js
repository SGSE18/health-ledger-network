'use strict';
const shim = require('fabric-shim');
const util = require('util');

const jsonstate = require('./utils/jsonstate')
const healthledger = require('./healthledger')

let Chaincode = class {

  async Init(stub) {
    console.info('=========== Instantiated chaincode ===========');
    return shim.success();
  }

  async Invoke(stub) {
    console.info('=========== Invoke chaincode ===========');
    let identity = new shim.ClientIdentity(stub)
    let state = new jsonstate(stub);

    let ledger = new healthledger(identity, state)

    switch(stub.fcn) {
      case 'user.get':
        payload = ledger.getUser();
        break;
      case 'user.post':
        break;
      case 'request.get':
        break;
      case 'request.post':
        break;
      case 'treatment.get':
        break;
      case 'treatment.post':
        break;
      case 'treatment.put':
        break;
    }

    payload = payload ? Buffer.from(JSON.stringify(payload)) : payload
    return shim.success(payload);
  }

};

shim.start(new Chaincode());
