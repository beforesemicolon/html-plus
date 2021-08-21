const {CustomAttribute} = require("./CustomAttribute");

class Ignore extends CustomAttribute {
  execute = true;
  
  render(value, node) {
    let content = `${node.innerHTML}${value || ''}`;
    
    if (node.hasAttribute('escape')) {
      content = content
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      
      node.removeAttribute('escape');
    }
    
    const clone = node.cloneNode();
    clone.innerHTML = content;
  
    return clone.outerHTML;
  }
}

module.exports.Ignore = Ignore;
