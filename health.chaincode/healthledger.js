module.exports = class {
  constructor(identity, state) {
    this.identity = identity;
    this.state = state;
  }

  get Cert() {
    return this.identity.cert;
  }

  get UserId() {
    return this.Cert.serial;
  }

  get Subject() {
    return this.Cert.subject;
  }

  get UserType() {
    return this.Subject.organizationalUnitName;
  }

  get CommonName() {
    return this.Subject.commonName;
  }

  /*
   * Gets a user by the calling certifcate
   */
  async getUserByCert(throwError = false) {
    let user = await this.state.get(this.UserId);
    if(throwError && user == null)
      throw new Error("getUserByCert: Unknown User '" + this.UserId + "'")

    return user;
  }

  /*
   * Gets a user by his public key (not the "calling" certificate)
   */
  async getUserByPublicKey(publicKey, throwError = true){
    let results = await this.state.query({ selector: { publicKey:publicKey } });

    if(throwError && (results == null || results.length == 0))
      throw new Error("getUserByPublicKey: Unknown User '" + publicKey + "'");

    return results != null && results.length > 0 ? results[0] : null;
  }


  /*
   * Gets the user which is linked with the "calling" certificate
   */
  async getUser() {
    let user = await this.getUserByCert();

    if(user == null)
      return null;

    return {
      name: this.CommonName,
      type: this.UserType,
      publicKey: user.publicKey
    }
  }

  /*
   * Creates the user with the given userInfo and the "calling" certificate
   */
  async postUser(userInfo) {
    let user = {
      publicKey: userInfo.publicKey,
      requests: []
    }

    if(this.UserType == "Patient")
      user.treatments = []

    await this.state.put(this.UserId, user);
  }

  /*
   * Gets the request of the user with the "calling" certifcate
   */
  async getRequests() {
    let user = await this.getUserByCert(true);

    return user.requests;
  }

  /*
   * Posts a request to the user with the given publickey
   */
  async postRequest(publicKey, request) {
    let result = await this.getUserByPublicKey(publicKey);
    let user = result.value;

    user.requests.push(request);

    return await this.state.put(result.key, user);
  }

  /*
   * Updates a request of the user with the given publickey
   */
  async updateRequest(publicKey, requestId, requestResult) {
    let result = await this.getUserByPublicKey(publicKey);
    let user = result.value;

    for(let request of user.requests) {
      if(request.id == requestId) {
        request.Result = requestResult;
      }
    }

    return await this.state.put(result.key, user);
  }

  /*
   * gets the treatments of the user with the "calling" certificate
   */
  async getTreatments() {
    if(this.UserType !== "Patient")
      throw new Error("Only patients can have treatments");

    let user = await this.getUserByCert(true);

    return user.treatments;
  }

  /*
   * adds the treatment to the user with the given publickey
   */
  async postTreatment(publicKey, treatment) {
    if(this.UserType !== "Arzt")
      throw new Error("Only doctors can post treatments");

    let result = await this.getUserByPublicKey(publicKey);
    let user = result.value;

    user.treatments.push(treatment);

    return await this.state.put(result.key, user);
  }

}
