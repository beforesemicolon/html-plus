class Attribute {
  bind = false;
  execute = false;
  
  process(value) {
    return value;
  }
  
  render(value, node) {
    return node;
  }
}

module.exports.Attribute = Attribute;