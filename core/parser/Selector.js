class Selector {
  operator = null;
  modifier = null;
  
  constructor(type, name = null, value = null) {
    this.type = type;
    this.name = name;
    this.value = value;
  }
  
  static global() {
    return new Selector('global', null, '*')
  }
  
  static tag(name) {
    return new Selector('tag', name)
  }
  
  static class(value = null) {
    return new Selector('attribute', 'class', value)
  }
  
  static id(value = null) {
    return new Selector('attribute', 'id', value)
  }
  
  static attribute(name, value = null) {
    return new Selector('attribute', name, value)
  }
  
  static pseudoClass(name, value = null) {
    return new Selector('pseudo-class', name, value)
  }
  
  static combinator(value = null) {
    return new Selector('combinator', null, value)
  }
}

module.exports.Selector = Selector;
