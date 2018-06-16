const Network = require('health-ledger-network')

const assert = require('assert');

const identity = {
   username: "user1",
   mspid: "MainOrgMSP",
   key: "-----BEGIN PRIVATE KEY-----\nMIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgU3tEhOdIpi0C3ETO\njsXa/8d2IiJ3HOKEbKtr5VwvQuuhRANCAAQj18/ykf/tjQiksmYhct7dQCXjDInX\nap+OxfBuh9VcexNb2r2r/Vhe57c4F5UrjPLrkJmC2nI0HoAZ4uB/5PBC\n-----END PRIVATE KEY-----\n",
   cert: "-----BEGIN CERTIFICATE-----\nMIICMzCCAdqgAwIBAgIRAPqHGyhW4r5ppcuOuskqcWYwCgYIKoZIzj0EAwIweDEL\nMAkGA1UEBhMCREUxDDAKBgNVBAgTA05SVzESMBAGA1UEBxMJQmllbGVmZWxkMSEw\nHwYDVQQKExhtYWlub3JnLmhlYWx0aC1sZWRnZXIuZGUxJDAiBgNVBAMTG2NhLm1h\naW5vcmcuaGVhbHRoLWxlZGdlci5kZTAgFw0xODA1MzAwMDAzMTlaGA8yMTE4MDUw\nNjAwMDMxOVowbjEXMBUGA1UEAwwOSGFucyBNw4PCvGxsZXIxCzAJBgNVBAYTAkRF\nMQwwCgYDVQQIDANOUlcxITAfBgNVBAoMGG1haW5vcmcuaGVhbHRoLWxlZGdlci5k\nZTEVMBMGA1UECwwMVmVyc2ljaGVydW5nMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcD\nQgAEI9fP8pH/7Y0IpLJmIXLe3UAl4wyJ12qfjsXwbofVXHsTW9q9q/1YXue3OBeV\nK4zy65CZgtpyNB6AGeLgf+TwQqNNMEswDgYDVR0PAQH/BAQDAgeAMAwGA1UdEwEB\n/wQCMAAwKwYDVR0jBCQwIoAgZtgEVzqDE54+row60NKXoVreZIAYRFU1klbDSJZu\nACowCgYIKoZIzj0EAwIDRwAwRAIgIcF7V9d/hA87+VZBE1F3nbFE/qkmrBtKC+Y6\nb+/B2YkCIDofZv3tE86I4LJtiAqSj8c85fFtrblDYWltoB4lURRh\n-----END CERTIFICATE-----\n"
}


describe('users', () => {
  describe('get()', () => {
    it('should return Versicherung', async () => {
      let ledger = await Network.HealthClient.initWithIdentity(Network.Config.Azure, identity);

      let user = await ledger.getUser();

      assert(user != null, "User is null");
      assert(user.name === "Hans MÃ¼ller", "User is not Hans MÃ¼ller");
      assert(user.type === "Versicherung", "User is not Versicherung");
      assert(!user.treatments, "Treatements schould not leak")
      assert(!user.requests, "Requests schould not leak")
    });
  });

  describe('post()', () => {
    it('should create versicherung', async () => {
      let ledger = await Network.HealthClient.initWithIdentity(Network.Config.Azure, identity);

      await ledger.postUser({ publicKey: "asdasd"});

      let user = await ledger.getUser();

      assert(user != null, "User is null");
      assert(user.publicKey === "asdasd", "PublicKey does not match")
      assert(user.name === "Hans MÃ¼ller", "User is not Hans MÃ¼ller");
      assert(user.type === "Versicherung", "User is not Versicherung");
      assert(!user.treatments, "Treatements schould not leak")
      assert(!user.requests, "Requests schould not leak")
    }).timeout(20000);

  });

});

describe('requests', () => {

  describe('get()', () => {
    it('should return requests', async () => {
      let ledger = await Network.HealthClient.initWithIdentity(Network.Config.Azure, identity);

      let requests = await ledger.getRequests();

      assert(requests != null, "Requests is null");
    });
  });

  describe('post()', () => {
    it('should post a request', async () => {
      let ledger = await Network.HealthClient.initWithIdentity(Network.Config.Azure, identity);

      let requestsBefore = await ledger.getRequests();

      await ledger.postRequest('asdasd', { id: 'asd', requester: 'Deine Versicherung', requesterPublicKey: '4242', note: 'alles', duration: 12, treatment: true, attestation: true, recipe: true});

      let requests = await ledger.getRequests();

      assert(requests != null, "Requests is null");
      assert(requests.length > requestsBefore.length, "requests is equal")
    }).timeout(20000);
  })


  describe('update()', () => {
    it('should update a request', async () => {
      let ledger = await Network.HealthClient.initWithIdentity(Network.Config.Azure, identity);

      await ledger.updateRequest('asdasd', 'asd', {rejected: false, reason: 'aber nur gucken, nicht anfassen', treatment: []});
    }).timeout(20000);
  });

});

describe('treatments', () => {
  describe('get()', () => {
    it('should fail to get treatments of wrong user type', async () => {
      let ledger = await Network.HealthClient.initWithIdentity(Network.Config.Azure, identity);
      var error = null
      try {
        var treatments = await ledger.getTreatments();
      }
      catch(err) {
        error = err
      }
      assert(error != null, "No error!")
    });
  });

  describe('post()', () => {
    it('should fail to post a treatment as wrong user type', async () => {
      let ledger = await Network.HealthClient.initWithIdentity(Network.Config.Azure, identity);
      var error = null
      try {
        var treatments = await ledger.postTreatment(null);
      }
      catch(err) {
        error = err
      }
      assert(error != null, "No error!")
    }).timeout(20000);
  });
});
