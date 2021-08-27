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
  
  let nodeList = [root];
  let htmlString = '';

  while (nodeList.length) {
    const node = nodeList.shift();

    try {
      if (node instanceof Comment) {
        htmlString += node.toString() + closeAncestorTags(node);
        continue;
      }
  
      if (node instanceof Text) {
        if (!node.parentNode || (node.parentNode.tagName !== 'script' && node.parentNode.tagName !== 'style')) {
          node.textContent = bindData(node.textContent, node.context)
        }
    
        htmlString += node.toString() + closeAncestorTags(node);;
        continue;
      }
  
      if (node.tagName === null) {
        nodeList.unshift(...node.childNodes);
        continue;
      }
  
      const customAttr = getNextCustomAttribute(node.getAttributeNames());
  
      if (customAttr) {
        htmlString += renderByAttribute(node, customAttr, dt) + closeAncestorTags(node);
        continue;
      }
  
      if (customTagsRegistry.isRegistered(node.tagName)) {
        htmlString += renderTag(node, dt) + closeAncestorTags(node);
        continue;
      }
  
      for (let attribute of node.attributes) {
        if (!attribute.name.startsWith('on')) { // avoid binding event attributes
          node.setAttribute(attribute.name, bindData(attribute.value, node.context))
        }
      }
  
      dt.onRender(node, dt.nodeFile);
  
      htmlString += `<${node.tagName} ${node.attributes}`.trimRight() + '>';
  
      if (!selfClosingTags[node.tagName]) {
        if (node.childNodes.length) {
          nodeList.unshift(...node.childNodes)
        } else {
          htmlString += `</${node.tagName}>` + closeAncestorTags(node);
        }
      }
    } catch(e) {
      handleError(e, node, dt.nodeFile);
    }
  }

  return htmlString;
}

function closeAncestorTags(node) {
  let parent = node.parentNode;
  let str = '';
  
  while (parent && parent.lastChild === node) {
    if (parent.tagName) {
      str += `</${parent.tagName}>`;
    }
    node = parent;
    parent = node.parentNode;
  }
  
  return str;
}

function renderTag(node, metadata) {
  const {context, content, onRender, ...tagOpt} = metadata
  const tag = customTagsRegistry.get(node.tagName);
  const customAttributes = new Map();
  
  for (let attribute of node.attributes) {
    if (tag.customAttributes && tag.customAttributes.hasOwnProperty(attribute.name)) {
      let val = parseValue(processCustomAttributeValue(tag.customAttributes[attribute.name], attribute.value, node.context))
    
      customAttributes.set(attribute.name, val);
      
    } else if(!attribute.name.startsWith('on')) {
      node.setAttribute(attribute.name, bindData(attribute.value, node.context))
    }
  }
  
  if (customAttributes.size) {
    node._customAttributes = customAttributes;
  }
  
  metadata.onRender(node, metadata.nodeFile);
  
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
    val = parseValue(processCustomAttributeValue(handler, val, node.context));
  }
  
  const parentNode = node.parentNode;
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
  
  // the custom attribute may return a different node than the original
  // when that is the case it is necessary to swap it so the
  // node tree is accurate
  if (node !== result) {
    parentNode.replaceChild(result, node)
  }
  
  return render({...metadata, node: result});
}

function parseValue(val) {
  if (typeof val === 'string') {
    try {
      val = JSON.parse(val)
    } catch (e) {
    }
  }
  
  return val;
}

module.exports.render = render;
