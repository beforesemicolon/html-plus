const {html} = require("../html");

class Inject{
  constructor(node, options) {
    this.content = null;
    this.node = node;
    
    const {rootNode} = options;
    const markup = node.getAttribute('html');
    
    if (markup) {
      this.content = markup
    } else if (rootNode) {
      if (rootNode.childNodes.length) {
        const injectId = node.getAttribute('id');

        if (injectId) {
          this.content = rootNode.children.filter(childNode => {
            const include = childNode.getAttribute('inject-id') === injectId

            if (include) {
              childNode.removeAttribute('inject-id');
              childNode.setContext('$$included', true);
            }

            return include;
          }).join('');
        } else {
          this.content = rootNode.childNodes.filter(childNode => {
            return childNode.nodeValue !== null ||
              (!childNode.hasAttribute('inject-id') && !childNode.context['$$included']);
          }).join('');
        }
      }
    }
  }
  
  static customAttributes = {
    html: {execute: true}
  }
  
  render() {
    return this.content
      ? html(this.content)
      : this.node.childNodes.length
        ? html(this.node.innerHTML)
        : '';
  }
}

module.exports.Inject = Inject;
