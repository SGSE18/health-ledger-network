
class MockState {
  constructor() {
    this.data = {
      'FA871B2856E2BE69A5CB8EBAC92A7166': {
        publicKey: 'asdkljhsadfasfdasdfsdfsdaf',
        name: 'Hans Müller',
        requests: [],
        treatments: [{id:"asd"},{id:"bsd"}]
      }
    };
  }

  async getState(key) {
    return this.data[key];
  }

  async putState(key, obj) {
    this.data[key] = obj;
  }
}

module.exports = {
  identity: {
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
  state: new MockState()
}
