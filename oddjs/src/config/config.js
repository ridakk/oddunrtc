class Config {

  constructor() {
    this.capabilities = new Map();
  }

  validate(keys) {
    // TODO: send product and js key to server, server should return services etc...
    return keys;
  }

  get capabilities() {
    return this.capabilities;
  }

}

export default new Config();
