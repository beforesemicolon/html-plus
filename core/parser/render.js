const {Text} = require('./Text');
const {Comment} = require('./Comment');
const {RenderNode} = require('./RenderNode');
const {selfClosingPattern} = require("./utils/regexPatterns");
const {customAttributesRegistry} = require("./default-attributes/CustomAttributesRegistry");
const {customTagsRegistry} = require("./default-tags/CustomTagsRegistry");
const {defaultTagsMap} = require("./default-tags");
const {defaultAttributesName} = require("./default-attributes");
const {bindData} = require("./utils/bind-data");
const {processCustomAttributeValue} = require("./utils/process-custom-attribute-value");
const {parseHTMLString, Element} = require("./Element");

const defaultOptions = {
  onRender() {
  },
  file: null,
  node: null,
  partialFiles: [],
  rootNode: null,
  content: '',
  context: {}
}

function render(dt = defaultOptions) {
  if (typeof dt === 'string') {
    dt = {content: dt};
  }
  
  dt = {...defaultOptions, ...dt};
  
  let root;
  
  if (dt.node && dt.node instanceof Element) {
    root = dt.node;
  } else {
    let content = (dt.content || dt.file?.toString()) ?? '';
    
    if (!content) {
        return '';
    }
    
    root = parseHTMLString(content, dt.context);
  }
  
  return (function renderNode(node) {
    if (node instanceof Comment) {
      dt.onRender(node);
      return node.toString();
    }
    
    if (node instanceof Text) {
      if (!node.parentNode || (node.parentNode.tagName !== 'script' && node.parentNode.tagName !== 'style')) {
        node.textContent = bindData(node.textContent, node.context)
      }
      
      dt.onRender(node);
      return node.toString();
    }
    
    if (node.tagName === null) {
      return node.childNodes.map(renderNode).join('');
    }
    
    for (let attr of defaultAttributesName) {
      if (node.hasAttribute(`#${attr}`)) {
        return renderByAttribute(node, `#${attr}`, dt);
      }
    }
    
    if (customTagsRegistry.isRegistered(node.tagName)) {
      return renderTag(node, dt);
    }
    
    for (let attribute of node.attributes) {
      node.setAttribute(attribute.name, bindData(attribute.value, node.context))
    }
    
    dt.onRender(node);
    
    const isSelfClosing = selfClosingPattern.test(node.tagName);
    let tag = `<${/doctype/i.test(node.tagName) ? '!' : ''}${node.tagName} ${node.attributes}`.trim();
    
    if (isSelfClosing) {
      tag = tag.trim() + '>'
    } else {
      tag = tag.trim() + `>${node.childNodes.map(renderNode).join('')}</${node.tagName}>`;
    }
    
    return tag;
  })(root)
}

function renderTag(node, metadata) {
  const {context, content, onRender, ...tagOpt} = metadata
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
    instance = new tag(node, tagOpt)
  } else {
    instance = tag(node, tagOpt);
  }
  
  let result;
  
  if (typeof instance === 'function') {
    result = instance();
  }
  
  if (typeof instance.render === 'function') {
    result = instance.render();
  }
  
  if (result instanceof RenderNode) {
    result = render({
      ...metadata,
      node: null,
      file: result.file || metadata.file,
      rootNode: node,
      content: result.htmlString,
      context: {...node.context, ...result.context}
    });
  }
  
  if (defaultTagsMap[node.tagName]) {
    return result || '';
  }
  
  // render the tag when it is a custom user tag
  return `<${node.tagName}>${result || ''}</${node.tagName}>`
}

function renderByAttribute(node, attrName, {context, content, ...metadata}) {
  const attr = customAttributesRegistry.get(attrName.slice(1));
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
  
  if (typeof result === 'string') {
    return result;
  }
  
  if (result instanceof RenderNode) {
    return render({
      ...metadata,
      node: null,
      file: result.file || metadata.file,
      rootNode: node,
      content: result.htmlString,
      context: {...node.context, ...result.context}
    });
  }
  
  return render({...metadata, node: result});
}

module.exports.render = render;
