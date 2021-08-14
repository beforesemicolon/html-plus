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
        const attr = new Attr(match[1], match[2] || match[3] || match[4] || null);
  
        this.#attributeString += attr + ' ';
        this.#map.set(attr.name, attr);
        iteratedAttributes.add(attr.name);
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
    return this.#attributeString.trim();
  }
}

module.exports.Attributes = Attributes;
