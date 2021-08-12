class Attr {
  #name;
  #value;
  #isSpecial = false;
  
  constructor(name, value = null) {
    this.#name = name;
    this.#value = value;
  }
  
  get name() {
    return this.#name;
  }
  
  get value() {
    return this.#value;
  }
  
  get isSpecial() {
    return this.#isSpecial;
  }
  
  toString() {
    return this.value ? `${this.name}="${this.value}"` : this.name;
  }
}

module.exports.Attr = Attr;
