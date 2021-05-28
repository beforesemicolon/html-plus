const {Tag} = require('../Tag');

class Variable extends Tag {
  constructor(tagInfo) {
    super(tagInfo);
    
    const {attributes, innerHTML} = tagInfo;
    
    const name = attributes.name;
    const value = attributes.value ?? innerHTML ?? '';
    
    if (!name) {
      throw new Error(`Variable must have a name`);
    }

    if (!/^[a-zA-Z_][a-zA-Z0-9_$]*$/.test(name.trim())) {
      throw new Error(`Invalid variable name "${name}"`);
    }

    if (!`${value}`.trim()) {
      throw new Error(`Variable name "${name}" is missing value`);
    }
    
    if (/<([a-zA-Z][a-zA-Z0-9]*)\b[^>]*(\/>|>(.*?)<\/\1>)/gm.test(`${value}`.trim())) {
      throw new Error(`Variable children cannot be HTML tags`);
    }

    this.name = name;
    this.value = value;
  }
  
  get context() {
    return {
      [this.name]: this.value
    };
  }
}

module.exports.Variable = Variable;
