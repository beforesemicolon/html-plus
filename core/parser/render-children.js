const {HTMLNode} = require("./HTMLNode");

const renderChildren = (childNodes = []) => {
  if (childNodes.length) {
    return Promise.all(childNodes.map(async node => {
        if (node instanceof HTMLNode) {
          return node.render();
        }
      
        return node
      }))
      .then(res => {
        return res.join('');
      });
  }
  
  return '';
}

module.exports.renderChildren = renderChildren;