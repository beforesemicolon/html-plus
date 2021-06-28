const {composeTagString} = require("../parser/compose-tag-string");
const {Attribute} = require("../Attribute");

class Ignore extends Attribute {
  execute = true;
  
  render(value, node) {
    let content = value
      ? `${node.innerHTML}${value}`
      : node.innerHTML;
    
    if (node.attributes.hasOwnProperty('escape')) {
      content = content
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      
      node.removeAttribute('escape');
    }
  
    node.removeAttribute('fragment');
    
    return composeTagString(node, content);
  }
}

module.exports.Ignore = Ignore;