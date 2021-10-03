
class Selector {
  constructor(type, name = null, value = null, operator = null, modifier = null) {
    if (!/tag|global|attribute|pseudo-class|combinator/.test(type)) {
        throw new Error('Invalid or missing selector type.')
    }
    
    this.type = type;
    this.name = name;
    this.value = value;
    this.operator = operator;
    this.modifier = modifier;
  }
  
  static get TYPE() {
    return {
      TAG: 'tag',
      GLOBAL: 'global',
      ATTRIBUTE: 'attribute',
      PSEUDO_CLASS: 'pseudo-class',
      COMBINATOR: 'combinator',
    }
  }
  
  static global() {
    return new Selector(Selector.TYPE.GLOBAL, null, '*')
  }
  
  static tag(name) {
    return new Selector(Selector.TYPE.TAG, name)
  }
  
  static class(value = null) {
    return new Selector(Selector.TYPE.ATTRIBUTE, 'class', value, '~')
  }
  
  static id(value = null) {
    return new Selector(Selector.TYPE.ATTRIBUTE, 'id', value)
  }
  
  static attribute(name, value = null, operator = null, modifier = null) {
    return new Selector(Selector.TYPE.ATTRIBUTE, name, value, operator, modifier)
  }
  
  static pseudoClass(name, value = null) {
    return new Selector(Selector.TYPE.PSEUDO_CLASS, name, value)
  }
  
  static combinator(value = null) {
    return new Selector(Selector.TYPE.COMBINATOR, null, value)
  }
  
  toString() {
    switch (this.type) {
      case 'global':
        return this.value;
      case 'tag':
        return this.name;
      case 'combinator':
        return this.value === ' ' ? this.value : ` ${this.value} `;
      case 'attribute':
        switch (this.name) {
          case 'id':
            return `#${this.value}`;
          case 'class':
            return `.${this.value}`;
          default:
            return this.value === null
              ? `[${this.name}]`
              : `[${this.name}${this.operator || ''}="${this.value}"${this.modifier || ''}]`;
        }
      case 'pseudo-class':
        return this.value === null
          ? `:${this.name}`
          : `:${this.name}(${this.value})`;
      default:
        return '';
    }
  }
}

module.exports.Selector = Selector;
