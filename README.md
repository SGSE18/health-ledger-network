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

## Certificates
In order to interact with the hyperledger network, each user needs a private key
and a corresponding certificate signed by an hyperledger peer certificate
authority.

The health-ledger network consists of the organizations `health-ledger.de` and
`mainorg.health-ledger.de`. The latter one authorizes all peers and
health-ledger users, while the first one is reserved for the orderer. The
`private.key` and `cert.pem` file in the subfolders `ca` are the root certificates
and will be used to sign new participants for the network. The Fabric Framework
requires a private key generated with the elliptic curve algorithm.

### New user work flow
In Order to create a new key and a certificate signed by the
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


To automate this work flow there is a `newuser.sh` bash script in the `scripts`
subfolder of this repository. Just pass output filename of the private key and
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
commonName            :ASN.1 12:'Hans M\0xFFFFFFC3\0xFFFFFF83\0xFFFFFFC2\0xFFFFFFBCller'
Certificate is to be certified until May  6 00:03:19 2118 GMT (36500 days)
Sign the certificate? [y/n]:y


1 out of 1 certificate requests certified, commit? [y/n]y
```

## Chaincode deployment
