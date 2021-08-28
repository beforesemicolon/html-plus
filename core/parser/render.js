const {Text} = require('./Text');
const {Comment} = require('./Comment');
const {RenderNode} = require('./RenderNode');
const selfClosingTags = require("./utils/selfClosingTags.json");
const {customAttributesRegistry} = require("./default-attributes/CustomAttributesRegistry");
const {customTagsRegistry} = require("./default-tags/CustomTagsRegistry");
const {defaultTagsMap} = require("./default-tags");
const {bindData} = require("./utils/bind-data");
const {processCustomAttributeValue} = require("./utils/process-custom-attribute-value");
const {parseHTMLString, Element} = require("./Element");
const {handleError} = require("./utils/handle-error");
const {getNextCustomAttribute} = require("./utils/getNextCustomAttribute");

const defaultOptions = {
  onRender() {
  },
  file: null,
  node: null,
  nodeFile: null,
  partialFiles: [],
  rootNode: null,
  content: '',
  context: {}
}

function render(dt = defaultOptions) {
  if (typeof dt === 'string') {
    dt = {content: dt};
  }
  
  dt = {...defaultOptions, ...dt, nodeFile: dt.nodeFile || dt.file};
  
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
    try {
      if (node instanceof Comment) {
        dt.onRender(node, dt.file);
        return node.toString();
      }
      
      if (node instanceof Text) {
        if (!node.parentNode || (node.parentNode.tagName !== 'script' && node.parentNode.tagName !== 'style')) {
          node.textContent = bindData(node.textContent, node.context)
        }
        
        dt.onRender(node, dt.file);
        return node.toString();
      }
      
      if (node.tagName === null) {
        return node.childNodes.map(renderNode).join('');
      }
      
      const customAttr = getNextCustomAttribute(node.getAttributeNames());
      
      if (customAttr) {
        return renderByAttribute(node, customAttr, dt);
      }
      
      if (customTagsRegistry.isRegistered(node.tagName)) {
        return renderTag(node, dt);
      }
      
      for (let attribute of node.attributes) {
        if (!attribute.name.startsWith('on')) { // avoid binding event attributes
          node.setAttribute(attribute.name, bindData(attribute.value, node.context))
        }
      }
      
      dt.onRender(node, dt.file);
      
      let tag = `<${node.tagName} ${node.attributes}`.trimRight();
      
      if (selfClosingTags[node.tagName]) {
        tag += '>'
      } else {
        tag += `>${node.childNodes.map(renderNode).join('')}</${node.tagName}>`;
      }
      
      return tag;
    } catch (e) {
      handleError(e, node, dt.nodeFile);
    }
  })(root)
}

function renderTag(node, metadata) {
  const {context, content, onRender, ...tagOpt} = metadata
  const tag = customTagsRegistry.get(node.tagName);
  const customAttributes = new Map();
  
  for (let attribute of node.attributes) {
    if (tag.customAttributes && tag.customAttributes.hasOwnProperty(attribute.name)) {
      customAttributes.set(attribute.name,
        processCustomAttributeValue(tag.customAttributes[attribute.name], attribute.value, node.context)
      );
    } else if(!attribute.name.startsWith('on')) {
      node.setAttribute(attribute.name, bindData(attribute.value, node.context))
    }
  }
  
  if (customAttributes.size) {
    node._customAttributes = customAttributes;
  }
  
  metadata.onRender(node, metadata.file);
  
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
      nodeFile: result.file,
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
      nodeFile: result.file,
      rootNode: node,
      content: result.htmlString,
      context: {...node.context, ...result.context}
    });
  }
  
  return render({...metadata, node: result});
}

module.exports.render = render;
