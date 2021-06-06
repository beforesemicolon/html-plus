const {composeTagString} = require("../parser/compose-tag-string");
const {Attribute} = require("../Attribute");

class Ignore extends Attribute {
  render(condition, node) {
    return composeTagString(node, node.innerHTML);
  }
}

module.exports.Ignore = Ignore;