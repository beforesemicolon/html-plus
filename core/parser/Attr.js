const {customAttributesRegistry} = require('./default-attributes');

class Attr {
  #name;
  #value;
  #isSpecial;
  
  constructor(name, value = null) {
    this.#name = name.replace(/^[^a-z]*/i, '');
    this.#value = value;
    this.#isSpecial = customAttributesRegistry.isRegistered(this.#name);
  }
  
  get name() {
    return this.#name;
  }
  
  get value() {
    return this.#value;
  }
  
  toString() {
    if (this.#isSpecial) {
        return '';
    }
    
    return this.value ? `${this.name}="${this.value}"` : this.name;
  }
}

module.exports.Attr = Attr;
