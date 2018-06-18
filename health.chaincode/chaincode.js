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
    let args = stub.getFunctionAndParameters();

    let identity = new shim.ClientIdentity(stub)
    let state = new jsonstate(stub);

    let ledger = new healthledger(identity, state)

    console.info(`function: ${args.fcn}`)
    console.info(`params: ${args.params}`)

    try {
      let payload = null;

      switch(args.fcn) {
        case 'user.get':
          payload = await ledger.getUser();
          break;
        case 'user.post':
          if(!args.params || args.params.length != 1)
            throw new Error('insufficient parameters');

          let userInfo = JSON.parse(args.params[0]);

          payload = await ledger.postUser(userInfo);
          break;
        case 'request.get':
          payload = await ledger.getRequests();
          break;
        case 'request.post':
          if(!args.params || args.params.length != 2)
            throw new Error('insufficient parameters');

          let request = JSON.parse(args.params[1]);

          payload = await ledger.postRequest(args.params[0], request);
          break;
        case 'request.put':
          if(!args.params || args.params.length != 3)
            throw new Error('insufficient parameters');

          let requestResult = JSON.parse(args.params[2]);

          payload = await ledger.updateRequest(args.params[0], args.params[1], requestResult);
          break;
        case 'treatment.get':
          payload = await ledger.getTreatments();
          break;
        case 'treatment.post':
          if(!args.params || args.params.length != 2)
            throw new Error('insufficient parameters');

          let treatment = JSON.parse(args.params[1]);

          payload = await ledger.postTreatment(args.params[0], treatment);
          break;
          case 'treatment.redeem':
          if(!args.params || args.params.length != 2)
            throw new Error('insufficient parameters');

          payload = await ledger.redeemTreatment(args.params[0], args.params[1]);
          break;
        default:
          throw new Error('unknown function');
          break;
      }

      console.info(`result: ${JSON.stringify(payload)}`);

      payload = payload ? Buffer.from(JSON.stringify(payload)) : payload
      return shim.success(payload);

    } catch(err) {
      return shim.error(err);
    }
  }

};

shim.start(new Chaincode());
