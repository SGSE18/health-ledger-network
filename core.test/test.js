const Network = require('health-ledger-network')
const uuidv4 = require('uuid/v4');

const assert = require('assert');

const ib = "../identities/"

const iPatient = require(`${ib}lpaso_patient.json`);
const iArzt = require(`${ib}hmayer_arzt.json`);
const iApotheke = require(`${ib}aesculap_apotheke.json`);
const iArbeitgeber = require(`${ib}xenic_arbeitgeber.json`);
const iVersicherung = require(`${ib}barmer_versicherung.json`);


describe('users', () => {


  describe('post()', () => {
    it('should create patient', async () => {
      let ledger = await Network.HealthClient.initWithIdentity(Network.Config.Azure, iPatient);
      await ledger.postUser({ publicKey: "patient_publickey"});
    }).timeout(20000);

    it('should create arzt', async () => {
      let ledger = await Network.HealthClient.initWithIdentity(Network.Config.Azure, iArzt);
      await ledger.postUser({ publicKey: "arzt_publickey"});
    }).timeout(20000);

    it('should create apotheke', async () => {
      let ledger = await Network.HealthClient.initWithIdentity(Network.Config.Azure, iApotheke);
      await ledger.postUser({ publicKey: "apotheke_publickey"});
    }).timeout(20000);

    it('should create arbeitgeber', async () => {
      let ledger = await Network.HealthClient.initWithIdentity(Network.Config.Azure, iArbeitgeber);
      await ledger.postUser({ publicKey: "arbeitgeber_publickey"});
    }).timeout(20000);

    it('should create versicherung', async () => {
      let ledger = await Network.HealthClient.initWithIdentity(Network.Config.Azure, iVersicherung);
      await ledger.postUser({ publicKey: "versicherung_publickey"});
    }).timeout(20000);
  });

  describe('get()', () => {
    it('should return patient', async () => {
      let ledger = await Network.HealthClient.initWithIdentity(Network.Config.Azure, iPatient);

      let user = await ledger.getUser();

      assert(user != null, "Patient should exisits");
      assert(user.publicKey === "patient_publickey", "PublicKey does not match")
      assert(user.name === "Lenny Paso", "User is not Lenny Paso");
      assert(user.type === "Patient", "User is not Patient");
      assert(!user.treatments, "Treatements schould not leak")
      assert(!user.requests, "Requests schould not leak")
    });

    it('should return arzt', async () => {
      let ledger = await Network.HealthClient.initWithIdentity(Network.Config.Azure, iArzt);

      let user = await ledger.getUser();

      assert(user != null, "Arzt should exisits");
      assert(user.publicKey === "arzt_publickey", "PublicKey does not match")
      assert(user.name === "Dr. H. Mayer", "User is not Dr. H. Mayer");
      assert(user.type === "Arzt", "User is not Arzt");
      assert(!user.treatments, "Treatements schould not leak")
      assert(!user.requests, "Requests schould not leak")
    });

    it('should return apotheke', async () => {
      let ledger = await Network.HealthClient.initWithIdentity(Network.Config.Azure, iApotheke);

      let user = await ledger.getUser();

      assert(user != null, "Apotheke should exisits");
      assert(user.publicKey === "apotheke_publickey", "PublicKey does not match")
      assert(user.name === "Aesculap Apotheke", "User is not Aesculap Apotheke");
      assert(user.type === "Apotheke", "User is not Apotheke");
      assert(!user.treatments, "Treatements schould not leak")
      assert(!user.requests, "Requests schould not leak")
    });

    it('should return arbeitgeber', async () => {
      let ledger = await Network.HealthClient.initWithIdentity(Network.Config.Azure, iArbeitgeber);

      let user = await ledger.getUser();

      assert(user != null, "Arbeitgber should exisits");
      assert(user.publicKey === "arbeitgeber_publickey", "PublicKey does not match")
      assert(user.name === "xeniC GmbH", "User is not xeniC GmbH");
      assert(user.type === "Arbeitgeber", "User is not Arbeitgeber");
      assert(!user.treatments, "Treatements schould not leak")
      assert(!user.requests, "Requests schould not leak")
    });

    it('should return versicherung', async () => {
      let ledger = await Network.HealthClient.initWithIdentity(Network.Config.Azure, iVersicherung);

      let user = await ledger.getUser();

      assert(user != null, "Versicherung should exisits");
      assert(user.publicKey === "versicherung_publickey", "PublicKey does not match")
      assert(user.name === "Barmer Versicherungen", "User is not Barmer Versicherungen");
      assert(user.type === "Versicherung", "User is not Versicherung");
      assert(!user.treatments, "Treatements schould not leak")
      assert(!user.requests, "Requests schould not leak")
    });
  });
});



describe('requests', () => {

  let requestId = uuidv4();

  describe('post()', () => {
    it('should fail to post a request with wrong public key', async () => {
      let ledger = await Network.HealthClient.initWithIdentity(Network.Config.Azure, iArzt);

      var error = null
      try {
        await ledger.postRequest('not_exisiting', { id: requestId, requester: 'Dein Arzt', requesterPublicKey: '4242', note: 'alles', duration: 12, treatment: true, attestation: true, recipe: true});
      }
      catch(err) {
        error = err
      }
      assert(error != null, "No error!")

    }).timeout(20000);
  })

  describe('post()', () => {
    it('should post a request', async () => {
      let ledger = await Network.HealthClient.initWithIdentity(Network.Config.Azure, iArzt);
      await ledger.postRequest('patient_publickey', { id: requestId, requester: 'Dein Arzt', requesterPublicKey: '4242', note: 'alles', duration: 12, treatment: true, attestation: true, recipe: true});
    }).timeout(20000);
  })

  describe('get()', () => {
    it('should return requests', async () => {
      let ledger = await Network.HealthClient.initWithIdentity(Network.Config.Azure, iPatient);

      let requests = await ledger.getRequests();

      assert(requests != null, "Requests is null");

      let request = requests.find((r)=>{
        if(r.id == requestId)
          return r;
      });

      assert(request, "request does not exisits");

    });
  });


  describe('update()', () => {
    it('should update a request', async () => {
      let ledger = await Network.HealthClient.initWithIdentity(Network.Config.Azure, iPatient);

      await ledger.updateRequest('patient_publickey', requestId, {rejected: false, reason: 'aber nur gucken, nicht anfassen', treatment: []});
    }).timeout(20000);
  });

});

describe('treatments', () => {

  let treatmentId = uuidv4();

  describe('post()', () => {

    it('should fail to post a treatment as wrong user type', async () => {
      let ledger = await Network.HealthClient.initWithIdentity(Network.Config.Azure, iVersicherung);
      var error = null
      try {
        await ledger.postTreatment('patient_publickey', {id: treatmentId, category: 'Krank', diagnose: "Grippe", prescription:{ drug: 'abc', patient_name: 'Mr. Nice', doctor_name: 'Dr IQ', until_date: new Date(), note: 'Nicht alle auf einmal essen', redeemed: true} , attestation: null });
      }
      catch(err) {
        error = err
      }
      assert(error != null, "No error!")
    }).timeout(20000);

    it('should create treatment', async () => {
      let ledger = await Network.HealthClient.initWithIdentity(Network.Config.Azure, iArzt);
      await ledger.postTreatment('patient_publickey', {id: treatmentId, category: 'Krank', diagnose: "Grippe", prescription:{ drug: 'abc', patient_name: 'Mr. Nice', doctor_name: 'Dr IQ', until_date: new Date(), note: 'Nicht alle auf einmal essen', redeemed: true} , attestation: null });
    }).timeout(20000);
  });

  describe('get()', () => {

    it('should fail to get treatments of wrong user type', async () => {
      let ledger = await Network.HealthClient.initWithIdentity(Network.Config.Azure, iApotheke);
      var error = null
      try {
        var treatments = await ledger.getTreatments();
      }
      catch(err) {
        error = err
      }
      assert(error != null, "No error!")
    });

    it('should get treatments', async () => {
      let ledger = await Network.HealthClient.initWithIdentity(Network.Config.Azure, iPatient);
      var treatments = await ledger.getTreatments();

      assert(treatments != null, "no treatments");
      assert(treatments.length > 0, "at least 1 treatment should exisits");

      let treatment = treatments.find((t)=>{
        if(t.id == treatmentId)
          return t;
      });

      assert(treatment != null, "treatment does not exisits");

    });
  });
});
