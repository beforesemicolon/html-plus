const {composeTagString} = require("../compose-tag-string");

function Script(node) {
  return () => composeTagString(node, node.innerHTML);
}

module.exports.Script = Script;
