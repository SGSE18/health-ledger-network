# Health-Ledger-Network
Contains scripts to run pre configured docker images for health ledger and
create users to interact with the underlying hyperledger network.

## Hyperledger Fabric
To run the hyperledger network locally please install `docker` and
`docker-compose`.

### Start
Starts the hyperledger network, installs genesis block and channel configuration.
```sh
$ cd hyperledger
$ ./start.sh
```

### Stop
Stops the docker containers but preserves state.
```sh
$ cd hyperledger
$ ./stop.sh
```

### Teardown
Stop and removes the docker containers.
```sh
$ cd hyperledger
$ ./teardown.sh
```

### Network Structure
The health-ledger network is reachable on `health-ledger.westeurope.cloudapp.azure.com` and consists of following Nodes.
* Peer 0 - port :7051 / EventHub :7053
* Orderer - port :7050

To simplify the interaction with the network, there is a client wrapper (`ledgerclient.js`) in the `deploy-chaincode` subfolder and several scripts to demonstrate the usage. See also section [Chaincode deployment](#chaincode-deployment) for further information.

## Certificates
For the interaction with the hyperledger network, each user needs a private key
and a corresponding certificate signed by an hyperledger peer certificate
authority.

The health-ledger network consists of the organizations `health-ledger.de` and
`mainorg.health-ledger.de`. The latter one authorizes all peers and
health-ledger users, while the first one is reserved for the orderer. The
`private.key` and `cert.pem` file in the subfolders `ca` are the root certificates
and will be used to sign new participants for the network. The Fabric Framework
requires a private key generated with the elliptic curve algorithm.

### New user workflow
In order to create new keys and certificates, signed by the
`mainorg.health-ledger.de` organization, we can leverage the `openssl` command
line tool.

* `openssl ecparam -name prime256v1 -genkey -out private.key`

  generates the private key for the new user and uses the `prime256v1` elliptic
  curve algorithm.

* `openssl req -new -key private.key -sha256 -out cert.csr`

  starts an interactive command line to fill in the user information and outputs
  a certificate signing request. This request has now to be signed by certificate
  authority. Be sure to include the role (Patient, Arzt, etc..) of the user in
  the organization unit (OU) of the signing request.

* `openssl ca -keyfile ca-private.key -cert ca-cert.pem -in cert.csr -out cert.pem -md sha256`

  signs the request with the private key and certificate of the `mainorg.health-ledger.de`
  certificate authority.


To automate this workflow there is a `newuser.sh` bash script in the `scripts`
subfolder of this repository. Just pass a filename for the private key and
certifate as the first argument and follow the steps.

```sh
Cems-MBP-5:scripts cem$ ./newuser.sh user1
Generating a 256 bit EC private key
writing new private key to 'user1.key'
-----
You are about to be asked to enter information that will be incorporated
into your certificate request.
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields there will be a default value,
If you enter '.', the field will be left blank.
-----
Land [DE]:
Bundesland [NRW]:
Stadt [Bielefeld]:
Organization [mainorg.health-ledger.de]:
Patient, Arzt, Versicherung, Apotheke, Arbeitgeber [Patient]:Versicherung
Benutzername [Cem Basoglu]:Hans Müller
Using configuration from openssl.cnf
Check that the request matches the signature
Signature ok
The Subject's Distinguished Name is as follows
countryName           :PRINTABLE:'DE'
stateOrProvinceName   :ASN.1 12:'NRW'
localityName          :ASN.1 12:'Bielefeld'
organizationName      :ASN.1 12:'mainorg.health-ledger.de'
organizationalUnitName:ASN.1 12:'Versicherung'
commonName            :ASN.1 12:'Hans Müller'
Certificate is to be certified until May  6 00:03:19 2118 GMT (36500 days)
Sign the certificate? [y/n]:y


1 out of 1 certificate requests certified, commit? [y/n]y
```

## Chaincode deployment
For the deployment of chaincode to health-ledger network, the nodejs scripts in
the folder `deploy-chaincode` can be used.

```sh
Cems-MBP-5:deploy-chaincode cem$ node deploy.js ../testchaincode/ fabcar
info: [packager/Node.js]: packaging Node Chaincode from ../testchaincode/
{ success: true,
  txId:
   TransactionID {
     _nonce: <Buffer 16 37 6e 7d d0 6f e8 18 51 bb dd df 1a 6d 8a f4 82 8a d1 cc 77 e8 6c fb>,
     _transaction_id: 'e46e70d8558c477cb670cf20782163ad246a7f0ce5c8c67312904fc03951c0f9',
     _admin: true },
  install:
   [ [ [Object] ],
     { header: [ByteBuffer],
       payload: [ByteBuffer],
       extension: [ByteBuffer] } ],
  proposals:
   [ [ [Object] ],
     { header: [ByteBuffer],
       payload: [ByteBuffer],
       extension: [ByteBuffer] } ],
  transaction: { status: 'SUCCESS', info: '' } }
```
