const {handleError} = require("./handle-error");
const {renderByAttribute} = require("./render-by-attribute");
const {createCustomTag} = require("./create-custom-tag");
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
    
    // need to process custom tag early so any context that is set
    // is kept and used to update the nodes before it gets to rendering
    if (this.#tag) {
      this.attributes = processNodeAttributes(
        this.#node.attributes,
        this.#tag.customAttributes,
        {...this.#options.data, ...this.#node.context}
      );
      this.#tag = createCustomTag(this.#tag, this.#node, this, this.#options);
    }
    
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
      childNode.context = {...childNode.context, ...data};
      
      return childNode instanceof TextNode
        ? new TextNode(bindData(childNode.rawText, {...this.#options.data, ...this.context, ...childNode.context}))
        : new HTMLNode(childNode, this.#options)
    })
  }
  
  renderChildren(data = {}) {
    return Promise.all(
      this.#node.childNodes.map(childNode => {
        childNode.context = {...childNode.context, ...data}
        
        return childNode instanceof TextNode
          ? new TextNode(bindData(childNode.rawText, {...this.#options.data, ...this.context, ...childNode.context}))
          : (new HTMLNode(childNode, this.#options)).render()
      })
    ).then(res => res.join(''));
  }
  
  async #processAttribute(cb) {
    if (this.#node.rawAttrs.length && /\s?#[a-zA-Z][a-zA-Z-]+/g.test(this.#node.rawAttrs)) {
      const result = await renderByAttribute(this, this.#options);
    
      if (result === null) {
        return '';
      }
    
      if (typeof result === 'string') {
        return result;
      }
    }
    
    return await cb();
  }
  
  async render() {
    try {
      return this.#processAttribute(async () => {
        if (this.#tag) {
          return this.#tag.render();
        }
  
        this.attributes = processNodeAttributes(
          this.#node.attributes,
          {},
          {...this.#options.data, ...this.#node.context}
        );
  
        return (this.tagName
            ? composeTagString(this, await this.renderChildren(this.context), Object.keys(this.#options.customAttributes))
            : await this.renderChildren(this.context)
        ).trim();
      })
    } catch (e) {
      handleError(e, this.#node, this.#options);
    }
  }
}

module.exports.HTMLNode = HTMLNode;
