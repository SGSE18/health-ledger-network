const ledgerclient = require('./ledgerclient');
const chaincodeId = 'healthledger';

module.exports = class HealthClient {
  constructor(ledgerclient){
    this.client = ledgerclient;
  }

  static async initWithIdentity(config, identity){
    let c = Object.assign({}, config);
    c.identity = identity;

    let client = await ledgerclient.initFromConfig(c);

    return new HealthClient(client);
  }

  /*
   * Gets the user which is linked with the "calling" certificate
   */
  async getUser() {
    return await this.client.queryByChaincode(chaincodeId, 'user.get');
  }

  /*
   * Creates the user with the given userInfo and the "calling" certificate
   */
  async postUser(userInfo) {
    await this.client.autoSendTransaction(chaincodeId, 'user.post', [JSON.stringify(userInfo)]);
  }

  /*
   * Gets the request of the user with the "calling" certifcate
   */
  async getRequests() {
    return await this.client.queryByChaincode(chaincodeId, 'request.get');
  }

  /*
   * Posts a request to the user with the given publickey
   */
  async postRequest(publicKey, request) {
    return await this.client.autoSendTransaction(chaincodeId, 'request.post', [publicKey, JSON.stringify(request)]);
  }

  /*
   * Updates a request of the user with the given publickey
   */
  async updateRequest(publicKey, requestId, requestResult) {
    return await this.client.autoSendTransaction(chaincodeId, 'request.put', [publicKey, requestId, JSON.stringify(requestResult)]);
  }

  /*
   * gets the treatments of the user with the "calling" certificate
   */
  async getTreatments() {
    return await this.client.queryByChaincode(chaincodeId, 'treatment.get');
  }

  /*
   * adds the treatment to the user with the given publickey
   */
  async postTreatment(publicKey, treatment) {
    return await this.client.autoSendTransaction(chaincodeId, 'treatment.post', [publicKey, JSON.stringify(treatment)]);
  }

}
