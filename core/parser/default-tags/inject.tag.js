const {Element} = require("../Element");

class Inject{
  constructor(node, options) {
    const {rootNode} = options;
    const html = node.attributes['html'];
    this.content = null;
    this.node = node;
    
    if (html) {
      this.content = [new Element(html, options)]
    } else if (rootNode) {
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
            return !(childNode instanceof Element) || (
              childNode.attributes['inject-id'] === undefined &&
              (childNode.context && !childNode?.context['$$included'])
            );
          });
        }
      }
    }
  }
  
  static customAttributes = {
    html: {execute: true}
  }
  
  render() {
    return this.content
      ? this.content.join('') || this.node.childNodes().join()
      : this.node.childNodes().join();
  }
}

module.exports.Inject = Inject;
