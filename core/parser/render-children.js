const {HTMLNode} = require("./HTMLNode");

const renderChildren = (childNodes = []) => {
  return childNodes.map(node => {
    if (node instanceof HTMLNode) {
      return node.render();
    }
    
    return node
  }).join('');
}

module.exports.renderChildren = renderChildren;