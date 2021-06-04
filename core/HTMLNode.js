const {turnCamelOrPascalToKebabCasing} = require("./utils/turn-camel-or-pascal-to-kebab-casing");
const {bindData} = require("./utils/bind-data");
const {TextNode} = require("node-html-parser");
const {composeTagString} = require("./utils/compose-tag-string");
const {undoSpecialCharactersInHTML} = require("./utils/undo-special-characters-in-HTML");
const {processNodeAttributes} = require("./utils/process-node-attributes");

const defaultOptions = {
  env: 'development',
  data: {},
  rootNode: null,
  customTags: [],
  customAttributes: [],
  fileObject: null,
  onTraverse() {
  },
  partialFileObjects: [],
};

class HTMLNode {
  #node = null;
  #tag = null;
  #options = {};
  
  constructor(node, options) {
    options = {...defaultOptions, ...options}
    this.#node = node;
    this.#options = options;
    this.#tag = options.customTags[node.rawTagName];
    
    const customAttributes = this.#tag ? this.#tag.customAttributes : {}
    
    this.attributes = processNodeAttributes(
      node.attributes,
      customAttributes,
      {...options.data, ...node.context}
    );
    
    if (typeof options.onTraverse === 'function') {
      options.onTraverse(this);
    }
  }
  
  get tagName() {
    return this.#node.rawTagName
  }
  
  get context() {
    return this.#node.context ?? {};
  }
  
  get innerHTML() {
    return undoSpecialCharactersInHTML(this.#node.innerHTML);
  }
  
  setAttribute(key, value) {
    if (typeof key === 'string' && typeof value === 'string') {
      this.#node.setAttribute(turnCamelOrPascalToKebabCasing(key), value);
      this.attributes[key] = processNodeAttributes(
        {key: value},
        this.#tag ? this.#tag.customAttributes : {},
        {...this.#options.data, ...this.#node.context}
      );
    }
  }
  
  removeAttribute(key) {
    if (typeof key === 'string') {
      this.#node.removeAttribute(turnCamelOrPascalToKebabCasing(key));
      delete this.attributes[key];
    }
  }
  
  setContext(key, value = null) {
    if (typeof key === 'string') {
      this.#node.context[key] = value
    }
  }
  
  removeContext(key) {
    if (typeof key === 'string') {
      delete this.#node.context[key];
    }
  }
  
  childNodes(data) {
    return this.#node.childNodes.map(childNode => {
      childNode.context = {...this.#node.context, ...childNode.context, ...data}
      return childNode instanceof TextNode
        ? bindData(childNode.rawText, {...this.#options.data, ...childNode.context})
        : new HTMLNode(childNode, this.#options)
    })
  }
  
  renderChildren(data = {}) {
    return Promise.all(
      this.#node.childNodes.map(childNode => {
        childNode.context = {...this.#node.context, ...childNode.context, ...data}
        return childNode instanceof TextNode
          ? new TextNode(bindData(childNode.rawText, {...this.#options.data, ...childNode.context}))
          : (new HTMLNode(childNode, this.#options)).render()
      })
    ).then(res => res.join(''));
  }
  
  async render(customAttributes = {}) {
    return (this.#tag
        ? await renderCustomTag(this.#tag, this.#node, this, this.#options)
        : this.tagName
          ? composeTagString(
            this,
            await this.renderChildren(),
            Object.keys({...this.#options.customAttributes, ...customAttributes})
          )
          : await this.renderChildren()
    ).trim();
  }
}

async function renderCustomTag(tag, rawNode, node, nodeOptions) {
  let instance = () => '';
  const {customTags, customAttributes, onTraverse, ...opt} = nodeOptions
  
  const options = {
    ...opt,
    get partialFileObjects() {
      return opt.partialFileObjects.map(file => {
        // partial files are created outside the context of the node, therefore
        // the file root node needs to be update with the current node
        file.options = {...nodeOptions, rootNode: node};
        
        return file;
      })
    }
  }
  
  if (tag.toString().startsWith('class')) {
    instance = new tag(node, options)
  } else {
    instance = tag(node, options);
  }
  
  if (Object.keys(rawNode.context ?? {}).length) {
    const parentChildNodes = rawNode.parentNode.childNodes;
    // find the current child index in its parent child nodes list
    const childIndex = parentChildNodes.indexOf(rawNode);
    
    // loop all following child and update their context
    for (let i = childIndex + 1; i < parentChildNodes.length; i++) {
      parentChildNodes[i].context = {...(parentChildNodes[i].context || {}), ...rawNode.context};
    }
  }
  
  return typeof instance === 'function'
    ? (await instance()) ?? ''
    : typeof instance.render === 'function'
      ? (await instance.render()) ?? ''
      : '';
}


module.exports.HTMLNode = HTMLNode;
