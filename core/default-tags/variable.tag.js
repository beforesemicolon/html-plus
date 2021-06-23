const {HTMLNode} = require("../parser/HTMLNode");

class Variable {
  constructor(node) {
    const {attributes, innerHTML} = node;
    
    const name = attributes.name;
    let value = '';
    
    if (!name) {
      throw new Error(`Variable must have a name`);
    }
    
    if (!/^[a-zA-Z_][a-zA-Z0-9_$]*$/.test(name.trim())) {
      throw new Error(`Invalid variable name "${name}"`);
    }
    
    if (attributes.hasOwnProperty('value')) {
      value = attributes.value;
    } else {
      const content = node.childNodes();
      
      if (content.some(node => node instanceof HTMLNode)) {
        throw new Error(`Variable children cannot be HTML tags`);
      }
      
      value = content.toString();
    }
    
    node.setContext(name, value);
  }
  
  static customAttributes = {
    value: {execute: true}
  }
}

module.exports.Variable = Variable;
