class Attribute {
  value = '';
  bind = false;
  process(value) {
    return value;
  };
  render(value, node) {
    return node;
  }
}

module.exports.Attribute = Attribute;