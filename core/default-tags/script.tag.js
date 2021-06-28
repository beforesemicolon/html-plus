const {composeTagString} = require("../parser/compose-tag-string");

function Script(node) {
  return () => composeTagString(node, node.innerHTML);
}

module.exports.Script = Script;