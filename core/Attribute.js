class Attribute {
  value = '';
  bind = false;
  execute = false;
  key = '';
  
  constructor(key, value, bind, execute) {
    this.key = key;
    this.value = value;
    this.bind = bind;
    this.execute = execute;
  }
  
  process(value) {
    return value;
  }
  
  render(value, node) {
    return node;
  }
}

module.exports.Attribute = Attribute;