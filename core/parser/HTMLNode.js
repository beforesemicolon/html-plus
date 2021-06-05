const {handleError} = require("./handle-error");
const {renderByAttribute} = require("./render-by-attribute");
const {renderCustomTag} = require("./render-custom-tag");
const {replaceSpecialCharactersInHTML} = require("./utils/replace-special-characters-in-HTML");
const {bindData} = require("../utils/bind-data");
const {TextNode, parse} = require("node-html-parser");
const {composeTagString} = require("./compose-tag-string");
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
  
  constructor(nodeORHTMLString, options) {
    options = {...defaultOptions, ...options}
    this.#node = typeof nodeORHTMLString === 'string'
      ? parse(replaceSpecialCharactersInHTML(nodeORHTMLString))
      : nodeORHTMLString;
    this.#options = options;
    this.#tag = options.customTags[this.#node.rawTagName];
    this.attributes = this.#node.attributes;
    
    if (typeof options.onTraverse === 'function') {
      options.onTraverse(this, options.fileObject);
    }
  }
  
  get tagName() {
    return this.#node.rawTagName
  }
  
  get context() {
    return this.#node.parentNode
      ? {...this.#node.parentNode.context, ...this.#node.context}
      : (this.#node.context ?? {});
  }
  
  get innerHTML() {
    return undoSpecialCharactersInHTML(this.#node.innerHTML);
  }
  
  setAttribute(key, value) {
    if (typeof key === 'string' && typeof value === 'string') {
      this.#node.setAttribute(key, value);
      this.attributes[key] = processNodeAttributes(
        {key: value},
        this.#tag ? this.#tag.customAttributes : {},
        {...this.#options.data, ...this.#node.context}
      );
    }
  }
  
  removeAttribute(key) {
    if (typeof key === 'string') {
      this.#node.removeAttribute(key);
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
      childNode.context = {...this.context, ...childNode.context, ...data}
      return childNode instanceof TextNode
        ? bindData(childNode.rawText, {...this.#options.data, ...childNode.context})
        : new HTMLNode(childNode, this.#options)
    })
  }
  
  renderChildren(data = {}) {
    return Promise.all(
      this.#node.childNodes.map(childNode => {
        childNode.context = {...this.context, ...childNode.context, ...data}
        
        return childNode instanceof TextNode
          ? new TextNode(bindData(childNode.rawText, {...this.#options.data, ...childNode.context}))
          : (new HTMLNode(childNode, this.#options)).render()
      })
    ).then(res => res.join(''));
  }
  
  async render() {
    try {
      if (this.#node.rawAttrs.length && /\s?#[a-zA-Z][a-zA-Z-]+/g.test(this.#node.rawAttrs)) {
        const result = await renderByAttribute(this, this.#options);
    
        if (result === null) {
          return '';
        }
    
        if (typeof result === 'string') {
          return result;
        }
      }
  
      const customAttributes = this.#tag ? this.#tag.customAttributes : {}
      
      this.attributes = processNodeAttributes(
        this.#node.attributes,
        customAttributes,
        {...this.#options.data, ...this.#node.context}
      );
  
      return (this.#tag
          ? await renderCustomTag(this.#tag, this.#node, this, this.#options)
          : this.tagName
            ? composeTagString(this, await this.renderChildren(this.context), Object.keys(this.#options.customAttributes))
            : await this.renderChildren(this.context)
      ).trim();
    } catch(e) {
      handleError(e, this.#node, this.#options);
    }
  }
}

module.exports.HTMLNode = HTMLNode;
