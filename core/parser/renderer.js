const {HTMLNode} = require('./HTMLNode');
const {Text} = require('./Text');
const {Comment} = require('./Comment');
const {selfClosingPattern} = require("./utils/regexPatterns");
const {customAttributesRegistry} = require("./default-attributes");
const {bindData} = require("../utils/bind-data");

function renderer(root, opt = {}) {
  root.context = {...opt.context, $data: opt.data || {}};
  
  return (function render(node) {
    if (node instanceof Comment) {
      return node.toString();
    }
    
    if (node instanceof Text) {
      node.value = bindData(node.value, node.context)
      return node.toString();
    }
    
    if (node.tagName === null) {
      return node.childNodes.map(render).join('');
    }
  
    for (let attribute of node.attributes) {
      if (!customAttributesRegistry.isRegistered(attribute.name)) {
        node.setAttribute(attribute.name, bindData(attribute.value, node.context))
      }
    }
    
    const isSelfClosing = selfClosingPattern.test(node.tagName);
    let tag = `<${/doctype/i.test(node.tagName) ? '!' : ''}${node.tagName} ${node.attributes}`.trim();
    
    if (isSelfClosing) {
      tag = tag.trim() + '>'
    } else {
      tag = tag.trim() + `>${node.childNodes.map(render).join('')}</${node.tagName}>`;
    }
    
    return tag;
  })(root)
}

module.exports.renderer = renderer;
