const {Attribute} = require("../Attribute");

class Fragment extends Attribute {
  render(_, node) {
    return node.renderChildren();
  }
}

module.exports.Fragment = Fragment;