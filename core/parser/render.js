const {Text} = require('./Text');
const {Comment} = require('./Comment');
const {RenderNode} = require('./RenderNode');
const selfClosingTags = require("./utils/selfClosingTags.json");
const {customAttributesRegistry} = require("./default-attributes/CustomAttributesRegistry");
const {customTagsRegistry} = require("./default-tags/CustomTagsRegistry");
const {defaultTagsMap} = require("./default-tags");
const {bindData} = require("./utils/bind-data");
const {processCustomAttributeValue} = require("./utils/process-custom-attribute-value");
const {Element} = require("./Element");
const {parse} = require(".");
const {handleError} = require("./utils/handle-error");
const {getNextCustomAttribute} = require("./utils/getNextCustomAttribute");

const defaultOptions = {
  env: 'development',
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

/**
 * parsed HTML renderer
 * @param dt
 * @returns {string}
 */
function render(dt = defaultOptions) {
  if (typeof dt === 'string') {
    dt = {content: dt};
  }
  
  dt = {...defaultOptions, ...dt, nodeFile: dt.nodeFile || dt.file};
  
  let root;
  
  /**
   * use provided node or parse the html content instead
   */
  if (dt.node && dt.node instanceof Element) {
    root = dt.node;
  } else {
    let content = (dt.content || dt.file?.toString()) ?? '';
    
    if (!content) {
      return '';
    }
    
    root = parse(content, dt.context);
  }
  
  let nodeList = [root];
  let htmlString = '';

  while (nodeList.length) {
    const node = nodeList.shift();

    try {
      if (node instanceof Comment) {
        if (dt.env === 'development') {
          htmlString += node.toString() + closeAncestorTags(node);
        }
        continue;
      }
  
      if (node instanceof Text) {
        /**
         * it is necessary to ignore script and style tag text content because
         * it may contain content that resemble things to be bind
         */
        if (!node.parentNode || (node.parentNode.tagName !== 'script' && node.parentNode.tagName !== 'style')) {
          node.textContent = bindData(node.textContent, node.context)
        }
    
        htmlString += node.toString() + closeAncestorTags(node);
        continue;
      }
  
      /**
       * null nodes are normally root nodes containing everything
       * sort of like the DocumentElement
       */
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
        /**
         * ignore pattern attributes as it contains regex that must not be parsed
         * ignore on* attributes because these are tag event attributes which values
         * must be ignored for the same reason we are ignoring the style and script tags content
         */
        if (attribute.name !== 'pattern' && !attribute.name.startsWith('on')) {
          node.setAttribute(attribute.name, bindData(attribute.value, node.context))
        }
      }
  
      dt.onRender(node, dt.nodeFile);
  
      htmlString += `<${node.tagName} ${node.attributes}`.trimRight() + '>';
  
      if (selfClosingTags[node.tagName]) {
        htmlString += closeAncestorTags(node);
      } else if (node.childNodes.length) {
        nodeList.unshift(...node.childNodes)
      } else {
        htmlString += `</${node.tagName}>` + closeAncestorTags(node);
      }
    } catch(e) {
      handleError(e, node, dt.nodeFile);
    }
  }

  return htmlString;
}

/**
 * recursively upwards tag closing tag
 * @param node
 * @returns {string}
 */
function closeAncestorTags(node) {
  let parent = node.parentNode;
  let str = '';
  
  /**
   * only loop if the node is the last child of the parent node
   * to make sure it needs closing
   */
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
