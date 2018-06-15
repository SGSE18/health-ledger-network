/*
 * writes and reads json objects from state
 */

module.exports = class {
  constructor(stub) {
    this.stub = stub;
  }

  async getState(key) {
    let result = await this.stub.getState(key);

    if (!result || result.toString().length <= 0)
      return null;

    return JSON.parse(result.toString());
  }

  async putState(key, obj) {
    let sObj = JSON.stringify(obj);

    await stub.putState(key, Buffer.from(sObj));
  }

}
