class CustomAttribute {
  execute = false;
  
  process(value) {
    return value;
  }
  
  render(value, node) {
    return node;
  }
}

module.exports.CustomAttribute = CustomAttribute;
