const {renderChildren} = require("../parser/render-children");

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
            const include = childNode.attributes && childNode.attributes['inject-id'] === injectId
            
            if (include) {
              childNode.removeAttribute('inject-id');
              childNode.setContext('$$included', true);
            }
            
            return include;
          });
    
          if (content.length) {
            this.content = content;
          }
        } else {
          this.content = childNodes.filter(childNode => {
            return !childNode.attributes || (
              childNode.attributes['inject-id'] === undefined &&
              (childNode.context && !childNode?.context['$$included'])
            );
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