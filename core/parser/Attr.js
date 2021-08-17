const {customAttributesRegistry} = require('./default-attributes/CustomAttributesRegistry');

class Attr {
  #name;
  #value;
  #isSpecial;
  
  constructor(name, value = null) {
    this.#name = name.toLowerCase();
    this.#value = (value || '').trim() || null;
  }
  
  get name() {
    return this.#name;
  }
  
  get value() {
    return this.#value;
  }
  
  toString() {
    return (this.value ? `${this.name}="${this.value}"` : this.name);
  }
}

module.exports.Attr = Attr;
