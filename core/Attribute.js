class Attribute {
  value = '';
  bind = false;
  process = null;
  render(tag, value) {
    return tag;
  }
}

module.exports.Attribute = Attribute;