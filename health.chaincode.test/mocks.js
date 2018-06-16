
class MockState {
  constructor() {
    this.data = {
      'FA871B2856E2BE69A5228EBAC92A7166': {
        publicKey: 'asdhasd',
        requests: [{ id: 'yxw', requester: 'Dein Arbeitgeber', requesterPublicKey: '4242', note: 'Krankschreibung einsehen', duration: 12, treatment: false, attestation: true, recipe: false, Result: {rejected: null, reason: 'muss ja', treatment: []} },
                   { id: 'xwv', requester: 'Facebook', requesterPublicKey: '666', note: 'Vollstaendiger Einblick', duration: 99999999, treatment: true, attestation: true, recipe: true, Result: {rejected: true, reason: 'Warum?', treatment: []} }],
        treatments: [{id: "1337", category: 'Krank', diagnose: "Erkältung", prescription:null , attestation: null },
                     {id: "1337", category: 'Krank', diagnose: "Grippe", prescription:{ drug: 'abc', patient_name: 'Mr. Nice', doctor_name: 'Dr IQ', until_date: new Date(), note: 'Nicht alle auf einmal essen', redeemed: true} , attestation: null },
                     {id: "1337", category: 'Vorsorge', diagnose: "Blutabnahme", prescription:{ drug: 'abc', patient_name: 'Mr. Nice', doctor_name: 'Dr IQ', until_date: new Date(), note: 'Nicht alle auf einmal essen', redeemed: true} , attestation: { is_incapable: true, incapable_until: new Date(), incapable_since: new Date()} }]
      }
    };
  }

  async get(key) {
    return this.data[key];
  }

  async put(key, obj) {
    this.data[key] = obj;
  }

  async query(qry) {
    let selector = qry.selector;

    let results = []
    for(let serial in this.data) {
      let result = this.data[serial];

      for(let key in selector) {
        if(result[key] !== selector[key]) {
          result = null;
          break;
        }
      }

      if(result != null)
        results.push({ key: serial, value: result});
    }

    return results;
  }
}

module.exports = {
  identityVersicherung: {
    mspId: 'MainOrgMSP',
    cert:
    {
      version: 2,
      subject: {
        commonName: 'Hans Müller',
        countryName: 'DE',
        stateOrProvinceName: 'NRW',
        organizationName: 'mainorg.health-ledger.de',
        organizationalUnitName: 'Versicherung'
      },
      issuer: {
        countryName: 'DE',
        stateOrProvinceName: 'NRW',
        localityName: 'Bielefeld',
        organizationName: 'mainorg.health-ledger.de',
        commonName: 'ca.mainorg.health-ledger.de'
      },
      serial: 'FA871B2856E2BE69A5CB8EBAC92A7166',
      notBefore: '2018-05-30T00:03:19.000Z',
      notAfter: '2118-05-06T00:03:19.000Z',
      subjectHash: '9da1e6a9',
      signatureAlgorithm: 'ecdsa-with-SHA256',
      fingerPrint: 'C9:66:76:4D:F4:A8:FB:3C:64:61:84:41:0E:6E:7D:07:82:F8:CF:11',
      publicKey: { algorithm: 'id-ecPublicKey' },
      altNames: [],
      extensions: {
        keyUsage: 'Digital Signature',
        basicConstraints: 'CA:FALSE',
        authorityKeyIdentifier: 'keyid:66:D8:04:57:3A:83:13:9E:3E:AE:8C:3A:D0:D2:97:A1:5A:DE:64:80:18:44:55:35:92:56:C3:48:96:6E:00:2A'
      }
    },
    attrs: {},
    id: 'x509::/CN=Hans MÃÂ¼ller/C=DE/ST=NRW/O=mainorg.health-ledger.de/OU=Versicherung::/C=DE/ST=NRW/L=Bielefeld/O=mainorg.health-ledger.de/CN=ca.mainorg.health-ledger.de'
  },
  identityPatient: {
    mspId: 'MainOrgMSP',
    cert:
    {
      version: 2,
      subject: {
        commonName: 'Martin Koch',
        countryName: 'DE',
        stateOrProvinceName: 'NRW',
        organizationName: 'mainorg.health-ledger.de',
        organizationalUnitName: 'Patient'
      },
      issuer: {
        countryName: 'DE',
        stateOrProvinceName: 'NRW',
        localityName: 'Bielefeld',
        organizationName: 'mainorg.health-ledger.de',
        commonName: 'ca.mainorg.health-ledger.de'
      },
      serial: 'FA871B2856E2BE69A5228EBAC92A7166',
      notBefore: '2018-05-30T00:03:19.000Z',
      notAfter: '2118-05-06T00:03:19.000Z',
      subjectHash: '9da1e6a9',
      signatureAlgorithm: 'ecdsa-with-SHA256',
      fingerPrint: 'C9:66:76:4D:F4:A8:FB:3C:64:61:84:41:0E:6E:7D:07:82:F8:CF:11',
      publicKey: { algorithm: 'id-ecPublicKey' },
      altNames: [],
      extensions: {
        keyUsage: 'Digital Signature',
        basicConstraints: 'CA:FALSE',
        authorityKeyIdentifier: 'keyid:66:D8:04:57:3A:83:13:9E:3E:AE:8C:3A:D0:D2:97:A1:5A:DE:64:80:18:44:55:35:92:56:C3:48:96:6E:00:2A'
      }
    },
    attrs: {},
    id: 'x509::/CN=Hans MÃÂ¼ller/C=DE/ST=NRW/O=mainorg.health-ledger.de/OU=Versicherung::/C=DE/ST=NRW/L=Bielefeld/O=mainorg.health-ledger.de/CN=ca.mainorg.health-ledger.de'
  },
  identityDoctor: {
    mspId: 'MainOrgMSP',
    cert:
    {
      version: 2,
      subject: {
        commonName: 'Dr. Stegelmann',
        countryName: 'DE',
        stateOrProvinceName: 'NRW',
        organizationName: 'mainorg.health-ledger.de',
        organizationalUnitName: 'Arzt'
      },
      issuer: {
        countryName: 'DE',
        stateOrProvinceName: 'NRW',
        localityName: 'Bielefeld',
        organizationName: 'mainorg.health-ledger.de',
        commonName: 'ca.mainorg.health-ledger.de'
      },
      serial: 'FA871B2856E2BE69A5228EBAC92A3466',
      notBefore: '2018-05-30T00:03:19.000Z',
      notAfter: '2118-05-06T00:03:19.000Z',
      subjectHash: '9da1e6a9',
      signatureAlgorithm: 'ecdsa-with-SHA256',
      fingerPrint: 'C9:66:76:4D:F4:A8:FB:3C:64:61:84:41:0E:6E:7D:07:82:F8:CF:11',
      publicKey: { algorithm: 'id-ecPublicKey' },
      altNames: [],
      extensions: {
        keyUsage: 'Digital Signature',
        basicConstraints: 'CA:FALSE',
        authorityKeyIdentifier: 'keyid:66:D8:04:57:3A:83:13:9E:3E:AE:8C:3A:D0:D2:97:A1:5A:DE:64:80:18:44:55:35:92:56:C3:48:96:6E:00:2A'
      }
    },
    attrs: {},
    id: 'x509::/CN=Hans MÃÂ¼ller/C=DE/ST=NRW/O=mainorg.health-ledger.de/OU=Versicherung::/C=DE/ST=NRW/L=Bielefeld/O=mainorg.health-ledger.de/CN=ca.mainorg.health-ledger.de'
  },
  state: new MockState()
}
