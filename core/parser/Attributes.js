const {attrPattern} = require("./utils/regexPatterns");
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
    let match;
    let count = 0;
    
    while ((match = attrPattern.exec(this.#attributeString))) {
      count += 1;
    }
    
    return count;
  }
  
  getNamedItem(name) {
    const pattern = new RegExp(`(#?${name})(?:\\s*=\\s*(?:"([^"]*)"|'([^']*)'|(\\S+)))?`, 'ig');
    const attrMatch = this.#attributeString.match(pattern);
    
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
