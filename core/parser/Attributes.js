const {attrPattern} = require("./utils/regexPatterns");
const {Attr} = require("./Attr");

class Attributes {
  #attributeString = '';
  #map = new Map();
  
  constructor(attributeString = '') {
    let match = '';
    const iteratedAttributes = new Set();
  
    // manually collect attributes to remove duplicated attributes
    while ((match = attrPattern.exec(attributeString))) {
      if (!iteratedAttributes.has(match[1])) {
        const name = match[1];
        const val = match[2] || match[3] || match[4] || (
          // check if the value was explicitly left our is just empty
          new RegExp(`^\\s*${name}\\s*=`).test(match[0]) ? '' : null
        );
        
        const attr = new Attr(name, val);
  
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
