const mocks = require('./mocks');
const healthledger = require('../health.chaincode/healthledger')

const assert = require('assert');

describe('healthledger', () => {
  var ledger = null;
  beforeEach(() => {
    ledger = new healthledger(mocks.identity, mocks.state)
  });

  describe('user', () => {
    describe('get()', () => {
      it('should return user', async () => {
        var user = await ledger.getUser();
        assert(user != null);
      });
    });
  });

  describe('treatment', () => {
    describe('get()', () => {
      it('should return treatments', async () => {
        var treatments = await ledger.getTreatments();
        assert(treatments != null);
        assert(treatments.length > 0);
      });
    });
  });

});
