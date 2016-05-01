class Config {

  constructor() {
    this.profie = {};
  }

  validate(keys) {
    // TODO: send product and js key to server, server should return services etc...
    return keys;
  }

  get capabilities() {
    return this.profie.capabilities;
  }

}

export default new Config();
