/**
 * a simpler server-side DOM attr facade
 */
class Attr {
  #name;
  #value;
  
  constructor(name, value = null) {
    this.#name = name.toLowerCase();
    this.#value = value;
  }
  
  get name() {
    return this.#name;
  }
  
  get value() {
    return this.#value;
  }
  
  toString() {
    // if the value is null is because the value was explicitly left out
    // otherwise it can contain value or be an empty string
    return (this.value === null ? this.name : `${this.name}="${this.value}"`);
  }
}

module.exports.Attr = Attr;
