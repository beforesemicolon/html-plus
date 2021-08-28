const {Attr} = require("./Attr");

/**
 * a simpler server-side DOM attributes facade
 */
class Attributes {
  #map = new Map();
  
  constructor() {
    this[Symbol.iterator] = function* () {
      for (let attr of this.#map.values()) {
        yield attr
      }
    }
  }
  
  get length() {
    return this.#map.size;
  }
  
  getNamedItem(name) {
    return this.#map.get(name) || null;
  }
  
  setNamedItem(name, value = null) {
    this.#map.set(name, new Attr(name, value));
  }
  
  removeNamedItem(name) {
    this.#map.delete(name);
  }
  
  toString() {
    return Array.from(this.#map.values(), (val) => val.toString()).join(' ');
  }
}

module.exports.Attributes = Attributes;
