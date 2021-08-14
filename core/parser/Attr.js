const {customAttributesRegistry} = require('./default-attributes/CustomAttributesRegistry');

class Attr {
  #name;
  #value;
  #isSpecial;
  
  constructor(name, value = null) {
    this.#name = name.replace(/^[^a-z]*/i, '').toLowerCase();
    this.#value = (value || '').trim() || null;
    this.#isSpecial = customAttributesRegistry.isRegistered(this.#name);
  }
  
  get name() {
    return this.#name;
  }
  
  get value() {
    return this.#value;
  }
  
  toString() {
    return (this.#isSpecial ? '#' : '') +
      (this.value ? `${this.name}="${this.value}"` : this.name);
  }
}

module.exports.Attr = Attr;
