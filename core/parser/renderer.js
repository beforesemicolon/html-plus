const {Text} = require('./Text');
const {Comment} = require('./Comment');
const {selfClosingPattern} = require("./utils/regexPatterns");
const {customAttributesRegistry} = require("./default-attributes/CustomAttributesRegistry");
const {customTagsRegistry} = require("./default-tags/CustomTagsRegistry");
const {defaultTagsMap} = require("./default-tags");
const {defaultAttributesName} = require("./default-attributes");
const {bindData} = require("../utils/bind-data");
const {processCustomAttributeValue} = require("./utils/process-custom-attribute-value");
const {parseHTMLString, HTMLNode} = require("./HTMLNode");

function renderer(root) {
  return (function render(node) {
    if (node instanceof Comment) {
      return node.toString();
    }
    
    if (node instanceof Text) {
      if (!node.parentNode || (node.parentNode.tagName !== 'script' && node.parentNode.tagName !== 'style')) {
        node.value = bindData(node.value, node.context)
      }
      
      return node.toString();
    }
    
    if (node.tagName === null) {
      return node.childNodes.map(render).join('');
    }
    
    let attributeNode = null;
    
    if (new RegExp(`#${defaultAttributesName.join('|')}`, 'ig').test(node.attributes.toString())) {
      for (let attrName of defaultAttributesName) {
        if (node.hasAttribute(attrName)) {
          attributeNode = renderByAttribute(node, attrName);
          break;
        }
      }
    }
    
    if (typeof attributeNode === 'string') {
      return attributeNode;
    }
    
    if (!attributeNode || node === attributeNode) {
      if (customTagsRegistry.isRegistered(node.tagName)) {
        return renderTag(node);
      }
      
      for (let attribute of node.attributes) {
        node.setAttribute(attribute.name, bindData(attribute.value, node.context))
      }
      
      const isSelfClosing = selfClosingPattern.test(node.tagName);
      let tag = `<${/doctype/i.test(node.tagName) ? '!' : ''}${node.tagName} ${node.attributes}`.trim();
      
      if (isSelfClosing) {
        tag = tag.trim() + '>'
      } else {
        tag = tag.trim() + `>${node.childNodes.map(render).join('')}</${node.tagName}>`;
      }
      
      return tag;
    }
    
    return render(attributeNode);
  })(root)
}

function renderTag(node) {
  const tag = customTagsRegistry.get(node.tagName);
  const customAttributes = new Map();
  
  for (let name in tag.customAttributes) {
    if (tag.customAttributes.hasOwnProperty(name) && node.hasAttribute(name)) {
      customAttributes.set(
        name,
        processCustomAttributeValue(tag.customAttributes[name], node.getAttribute(name), node.context)
      );
    }
  }
  
  if (customAttributes.size) {
    node._customAttributes = customAttributes;
  }
  
  let instance;
  
  if (tag.toString().startsWith('class')) {
    instance = new tag(node)
  } else {
    instance = tag(node);
  }
  
  let result;
  
  if (typeof instance === 'function') {
    result = instance();
  }
  
  if (typeof instance.render === 'function') {
    result = instance.render();
  }
  
  if (result?.constructor?.name === 'Render') {
    result = renderer(parseHTMLString(result.htmlString, {...node.context, ...result.context}));
  }
  
  if (defaultTagsMap[node.tagName]) {
    return result || '';
  }
  
  // render the tag when it is a custom user tag
  return `<${node.tagName}>${result || ''}</${node.tagName}>`
}

function renderByAttribute(node, attrName) {
  const attr = customAttributesRegistry.get(attrName);
  const handler = new attr(node);
  let val = node.getAttribute(attrName);
  
  if (val) {
    val = processCustomAttributeValue(handler, val, node.context);
  }
  
  node.removeAttribute(attrName);
  
  let result = handler.render(val, node);
  
  if (!result) {
    return '';
  }
  
  if (result?.constructor?.name === 'Render') {
    result = renderer(parseHTMLString(result.htmlString, {...node.context, ...result.context}));
  }
  
  if (typeof result === 'string' || result instanceof HTMLNode) {
    return result;
  }
  
  return node;
}

module.exports.renderer = renderer;
