const {Attribute} = require("../../Attribute");

class Ignore extends Attribute {
  execute = true;
  
  render(value, node) {
    let content = value
      ? `${node.innerHTML}${value}`
      : node.innerHTML;
    
    if (node.hasAttribute('escape')) {
      content = content
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      
      node.removeAttribute('escape');
    }
  
    node.removeAttribute('fragment');
    
    return node.outerHTML;
  }
}

module.exports.Ignore = Ignore;
