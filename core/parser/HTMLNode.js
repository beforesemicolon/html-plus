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

class Text{
  constructor(value) {
    this.value = value;
  }
  
  toString() {
    return this.value;
  }
}

class HTMLNode {
  #node = null;
  #tag = null;
  #options = {};
  
  constructor(nodeORHTMLString, options) {
    options = {...defaultOptions, ...options}
    this.#node = typeof nodeORHTMLString === 'string'
      ? parse(replaceSpecialCharactersInHTML(nodeORHTMLString))
      : nodeORHTMLString;
    this.#node.context = {...this.#node.context};
    this.#options = options;
    this.#tag = options.customTags[this.#node.rawTagName];
    this.attributes = this.#node.attributes;
    
    this.#node.getContext = () => {
      return {...this.#node.parentNode?.getContext(), ...(this.#node.context ?? {})};
    }
    
    // need to process custom tag early so any context that is set
    // is kept and used to update the nodes before it gets to rendering
    if (this.#tag) {
      this.attributes = processNodeAttributes(
        this.#node.attributes,
        this.#tag.customAttributes,
        {$data: this.#options.data, ...this.context}
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
    return this.#node.getContext();
  }
  
  get innerHTML() {
    return undoSpecialCharactersInHTML(this.#node.innerHTML);
  }
  
  clone() {
    const outerHTML = this.#node.toString();
    const clonedNode = (parse(outerHTML)).childNodes[0];
  
    clonedNode.context = {...this.#node.context};
    clonedNode.parentNode.getContext = () => ({})
    
    return new HTMLNode(clonedNode, this.#options);
  }
  
  duplicate(context = {}) {
    const outerHTML = this.#node.toString();
    const clonedNode = parse(outerHTML).childNodes[0];
    
    clonedNode.context = {...this.#node.context, ...context};
    clonedNode.parentNode = this.#node.parentNode;
  
    if (clonedNode.parentNode) {
      const index = clonedNode.parentNode.childNodes.indexOf(this.#node);
  
      if (index >= 0) {
        this.#node.parentNode.childNodes.splice(index, 0, clonedNode)
      } else {
        this.#node.parentNode.appendChild(clonedNode)
      }
    }
    
    return new HTMLNode(clonedNode, this.#options);
  }
  
  setAttribute(key, value) {
    if (typeof key === 'string' && typeof value === 'string') {
      this.#node.setAttribute(key, value);
      this.attributes[key] = processNodeAttributes(
        {key: value},
        this.#tag ? this.#tag.customAttributes : {},
        {$data: this.#options.data, ...this.context}
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
  
  #childNodes(data = {}) {
    return this.#node.childNodes.map(childNode => {
      if (childNode instanceof TextNode) {
        const text = bindData(childNode.rawText, {
          $data: this.#options.data,
          ...this.context,
          ...childNode.context,
          ...data
        });
        
        return new TextNode(text);
      }
      
      return new HTMLNode(childNode, this.#options);
    })
  }
  
  childNodes(data) {
    return this.#childNodes(data);
  }
  
  renderChildren(data = {}) {
    const renderList = this.#childNodes(data);
    return renderList.join('');
  }
  
  render() {
    try {
      if (this.#node.rawAttrs.length && /\s?#[a-zA-Z][a-zA-Z-]+/g.test(this.#node.rawAttrs)) {
        const result = renderByAttribute(this, this.#options);
        
        if (result === null) {
          return '';
        }
        
        if (typeof result === 'string') {
          return result;
        }
      }
      
      if (this.#tag) {
        return this.#tag.render();
      }
      
      this.attributes = processNodeAttributes(
        this.#node.attributes,
        {},
        {$data: this.#options.data, ...this.context}
      );
      
      return (this.tagName
          ? composeTagString(this, this.renderChildren(), Object.keys(this.#options.customAttributes))
          : this.renderChildren()
      ).trim();
    } catch (e) {
      handleError(e, this.#node, this.#options);
    }
  }
  
  toString() {
    return this.render();
  }
}

module.exports.HTMLNode = HTMLNode;
