const {renderChildren} = require("../utils/render-children");

class Inject{
  constructor(node, options) {
    
    const {rootNode} = options;
    
    this.content = node.childNodes();
    
    if (rootNode) {
      const childNodes = rootNode.childNodes();
      
      if (childNodes.length) {
        const injectId = node.attributes['id'];
  
        if (injectId) {
          const content = childNodes.filter(childNode => {
            const include = childNode.attributes && childNode.attributes['injectId'] === injectId;
            
            if (include) {
              childNode.removeAttribute('injectId')
            }
            
            return include;
          });
    
          if (content.length) {
            this.content = content;
          }
        } else {
          this.content = childNodes.filter(childNode => {
            return !childNode.attributes || childNode.attributes['injectId'] === undefined;
          });
        }
      }
    }
  }
  
  async render() {
    return renderChildren(this.content);
  }
}

module.exports.Inject = Inject;