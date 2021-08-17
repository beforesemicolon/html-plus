const {CustomAttribute} = require("./CustomAttribute");
const {html} = require("../html");

class Fragment extends CustomAttribute {
  render(_, node) {
    return html(node.innerHTML);
  }
}

module.exports.Fragment = Fragment;
