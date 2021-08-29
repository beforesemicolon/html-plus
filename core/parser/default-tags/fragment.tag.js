const {html} = require("../html");

function Fragment(node) {
  return () => html(node.innerHTML);
}

module.exports.Fragment = Fragment;
