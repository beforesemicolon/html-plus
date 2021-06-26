const {composeTagString} = require("../parser/compose-tag-string");

function Style(node) {
  return () => composeTagString(node, node.innerHTML);
}

module.exports.Style = Style;