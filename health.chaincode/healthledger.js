module.exports = class {
  constructor(identity, state) {
    this.identity = identity;
    this.state = state;
  }

  get UserId() {
    return this.identity.cert.serial;
  }

  get UserType() {
    return this.identity.cert.subject.organizationalUnitName;
  }

  /*
   * Gets the user which is linked with the "calling" certificate
   */
  async getUser() {
    return await this.state.getState(this.UserId);
  }

  /*
   * Creates/Overrides the user with the "calling" certificate
   */
  async postUser(userData) {
    await this.state.putState(this.UserId, userData);
  }

  /*
   * Gets a user by his public key (not the "calling" certificate)
   */
  async getUserByPublicKey(publicKey){
    return null;
  }

  /*
   * Gets the request of the user with the "calling" certifcate
   */
  async getRequests() {
    let user = await this.getUser();
    if(user == null)
      return null;

    return user.requests;
  }

  /*
   * Posts a request to the user with the given publickey
   */
  async postRequest(publicKey, request) {
    let user = await this.getUserByPublicKey(publicKey);
    if(user == null)
      return

    user.requests.push(request);

    this.postUser(user);
  }

  /*
   * Updates a request of the user with the given publickey
   */
  async updateRequest(publicKey, requestResult) {

  }

  /*
   * gets the treatments of the user with the "calling" certificate
   */
  async getTreatments() {
    let user = await this.getUser();
    if(user == null)
      return null;

    return user.treatments;
  }

  /*
   * adds the treatment to the user with the given publickey
   */
  async postTreatment(publicKey, treatment) {

  }

}
