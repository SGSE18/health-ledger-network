const mocks = require('./mocks');
const healthledger = require('../health.chaincode/healthledger')

const assert = require('assert');


describe('users', () => {
  describe('get()', () => {
    it('should return null for versicherung', async () => {
      let ledger = new healthledger(mocks.identityVersicherung, mocks.state)

      let user = await ledger.getUser();

      assert(user == null, "User is not null");
    });

    it('should return Patient', async () => {
      let ledger = new healthledger(mocks.identityPatient, mocks.state)

      let user = await ledger.getUser();

      assert(user != null, "User is null");
      assert(user.publicKey === "asdhasd", "PublicKey does not match")
      assert(user.name === "Martin Koch", "User is not Martin Koch");
      assert(user.type === "Patient", "User is not Versicherung");
      assert(!user.treatments, "Treatements schould not leak")
      assert(!user.requests, "Requests schould not leak")
    });
  });

  describe('post()', () => {
    it('should create versicherung', async () => {
      let ledger = new healthledger(mocks.identityVersicherung, mocks.state)

      await ledger.postUser({ publicKey: "asdasd"});

      let user = await ledger.getUser();

      assert(user != null, "User is null");
      assert(user.publicKey === "asdasd", "PublicKey does not match")
      assert(user.name === "Hans Müller", "User is not Müller");
      assert(user.type === "Versicherung", "User is not Versicherung");
      assert(!user.treatments, "Treatements schould not leak")
      assert(!user.requests, "Requests schould not leak")
    });

  });

});

describe('requests', () => {

  describe('get()', () => {
    it('should return 2 requests', async () => {
      let ledger = new healthledger(mocks.identityPatient, mocks.state);

      let requests = await ledger.getRequests();

      assert(requests != null, "Requests is null");
      assert(requests.length == 2, "Requests is not 2");
      assert(requests[0].id == "yxw", "Request id not yxw");
    });
  });

  describe('post()', () => {
    it('should post a request', async () => {
      let ledger = new healthledger(mocks.identityVersicherung, mocks.state);

      await ledger.postRequest('asdhasd', { id: 'asd', requester: 'Deine Versicherung', requesterPublicKey: '4242', note: 'alles', duration: 12, treatment: true, attestation: true, recipe: true});

      ledger = new healthledger(mocks.identityPatient, mocks.state);

      let requests = await ledger.getRequests();

      assert(requests != null, "Requests is null");
      assert(requests.length == 3, "Requests is not 3");
      assert(requests[2].id == "asd", "Request id not asd");
      assert(requests[2].Result == null, "Request has a result");
    });
  })


  describe('update()', () => {
    it('it should update a request', async () => {
      let ledger = new healthledger(mocks.identityVersicherung, mocks.state);

      await ledger.updateRequest('asdhasd', 'asd', {rejected: false, reason: 'aber nur gucken, nicht anfassen', treatment: mocks.state.data['FA871B2856E2BE69A5228EBAC92A7166'].treatments});

      ledger = new healthledger(mocks.identityPatient, mocks.state);

      let requests = await ledger.getRequests();

      assert(requests != null, "Requests is null");
      assert(requests.length == 3, "Requests is not 3");
      assert(requests[2].id == "asd", "Request id not asd");
      assert(requests[2].Result !== null, "Request has no result");
      assert(requests[2].Result.rejected == false, "result is rejected");
    });
  });

});

describe('treatments', () => {
  describe('get()', () => {
    it('should fail to get treatments of wrong user type', async () => {
      let ledger = new healthledger(mocks.identityVersicherung, mocks.state)
      var error = null
      try {
        var treatments = await ledger.getTreatments();
      }
      catch(err) {
        error = err
      }
      assert(error != null, "No error!")
    });

    it('should return 3 treatments', async () => {
      let ledger = new healthledger(mocks.identityPatient, mocks.state);
      var treatments = await ledger.getTreatments();
      assert(treatments != null, "treatments is null");
      assert(treatments.length == 3, "treatments does not equal 3");
      assert(treatments[0].id == 1337, "id is not 1337");
    });
  });

  describe('post()', () => {

    it('should fail to post a treatment as wrong user type', async () => {
      let ledger = new healthledger(mocks.identityVersicherung, mocks.state)
      var error = null
      try {
        var treatments = await ledger.postTreatment(null);
      }
      catch(err) {
        error = err
      }
      assert(error != null, "No error!")
    });

    it('should post a treatment', async () => {
      let ledger = new healthledger(mocks.identityDoctor, mocks.state)
      await ledger.postTreatment("asdhasd", {id: "1338", category: 'Krank', diagnose: "Erkältung", prescription:null , attestation: null });

      ledger = new healthledger(mocks.identityPatient, mocks.state);
      var treatments = await ledger.getTreatments();
      assert(treatments != null, "treatments is null");
      assert(treatments.length == 4, "treatments does not equal 4");
      assert(treatments[3].id == 1338, "id is not 1338");
    });
  });
});
