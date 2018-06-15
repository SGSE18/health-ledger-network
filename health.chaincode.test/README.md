# Chaincode Tests

This folder contains mocks for the fabric shim in order to test the chaincode
without the need to actually run as chaincode on hyperledger fabric.

## Adding Tests

Tests are written with mocha and new test should be added to `test.js`:

```javascript
describe('treatment', () => {
  describe('get()', () => {
    it('should return treatments', async () => {
      var treatments = await ledger.getTreatments();
      assert(treatments != null);
      assert(treatments.length > 0);
    });
  });
});
```
