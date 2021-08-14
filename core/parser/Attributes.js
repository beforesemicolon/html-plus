const {attrPattern} = require("./utils/regexPatterns");
const {Attr} = require("./Attr");

class Attributes {
  #attributeString = '';
  #map = new Map();
  
  constructor(attributeString = '') {
    let match = '';
    const iteratedAttributes = new Set();
  
    // remove duplicated attributes
    while ((match = attrPattern.exec(attributeString))) {
      if (!iteratedAttributes.has(match[1])) {
        let value = match[2] || match[3] || match[4];
        let name = match[1];

        this.#attributeString += (this.#map.size ? ' ' : '') + (value ? `${name}="${value}"` : name);
        const attr = new Attr(name, value);
        this.#map.set(attr.name, attr);
        iteratedAttributes.add(name);
      }
    }
    
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
  
  toString() {
    return this.#attributeString;
  }
}

module.exports.Attributes = Attributes;
