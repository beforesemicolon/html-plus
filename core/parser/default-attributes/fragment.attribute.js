const {Attribute} = require("../../Attribute");
const {html} = require("../html");

class Fragment extends Attribute {
  render(_, node) {
    return html(node.innerHTML);
  }
}

module.exports.Fragment = Fragment;
