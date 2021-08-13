class Registry {
  #registry = {};
  
  define(name, value) {
    if (!this.isRegistered(name)) {
      this.#registry[name] = value;
    }
  }
  
  isRegistered(name) {
    return this.#registry.hasOwnProperty(name);
  }
  
  get(name) {
    return this.#registry[name] || null;
  }
}

module.exports.Registry = Registry;
