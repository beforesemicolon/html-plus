const {attrPattern, specificAttrPattern} = require("./utils/regexPatterns");
const {Attr} = require("./Attr");

class Attributes {
  #attributeString;
  
  constructor(attributeString = '') {
    this.#attributeString = attributeString.trim();
    
    this[Symbol.iterator] = function* () {
      let match;
      
      while ((match = attrPattern.exec(attributeString))) {
        let value = match[2] || match[3] || match[4];
        
        yield new Attr(match[1], value || null)
      }
    }
  }
  
  get length() {
    if (this.#attributeString.trim().length) {
      let match;
      let count = 0;
  
      while ((match = attrPattern.exec(this.#attributeString))) {
        count += 1;
      }
  
      return count;
    }
    
    return 0;
  }
  
  getNamedItem(name) {
    const attrMatch = this.#attributeString.match(specificAttrPattern(name));
    
    if (attrMatch) {
      let [name, value = null] = attrMatch[0].split('=');
      
      if (value) {
        value = value.slice(1, -1);
      }
      
      return new Attr(name, value);
    }
    
    return null;
  }
  
  toString() {
    return this.#attributeString;
  }
}

module.exports.Attributes = Attributes;
