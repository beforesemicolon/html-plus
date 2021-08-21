const {bindData} = require("../utils/bind-data");

class Variable {
  constructor(node) {
    const name = node.getAttribute('name');
    let value = '';
    
    if (!name) {
      throw new Error(`Variable must have a name`);
    }
    
    if (!/^[a-zA-Z_][a-zA-Z0-9_$]*$/.test(name.trim())) {
      throw new Error(`Invalid variable name "${name}"`);
    }
    
    if (node.hasAttribute('value')) {
      value = node.getAttribute('value');
    } else {
      if (node.children.length) {
        throw new Error(`Variable children cannot be HTML tags`);
      }
      
      value = bindData(node.innerHTML, node.context);
    }
    
    node.setContext(name, value);
    
    // propagate the context to all nodes that come after
    for (let i = node.parentNode.childNodes.indexOf(node) + 1; i < node.parentNode.childNodes.length; i++) {
      node.parentNode.childNodes[i].setContext(name, value);
    }
  }
  
  static customAttributes = {
    value: {execute: true}
  }
}

module.exports.Variable = Variable;
