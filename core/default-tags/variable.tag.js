class Variable {
  constructor(node) {
    const {attributes, innerHTML} = node;
    
    const name = attributes.name;
    const value = attributes.hasOwnProperty('value')
      ? attributes.value
      : innerHTML;
    
    if (!name) {
      throw new Error(`Variable must have a name`);
    }

    if (!/^[a-zA-Z_][a-zA-Z0-9_$]*$/.test(name.trim())) {
      throw new Error(`Invalid variable name "${name}"`);
    }
    
    if (/<([a-zA-Z][a-zA-Z0-9]*)\b[^>]*(\/>|>(.*?)<\/\1>)/gm.test(`${value}`.trim())) {
      throw new Error(`Variable children cannot be HTML tags`);
    }
  
    node.setContext(name, value);
  }
  
  static customAttributes = {
    name: null,
    value: {execute: true}
  }
}

module.exports.Variable = Variable;
