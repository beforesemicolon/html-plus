const {composeTagString} = require("../../index");
const {defineGetter} = require("../utils/define-getter");
const openCloseTagPattern = '<([\\w-]+)([^<>\\/]*)>(.*?)<\\/?\\1>';
const selfCloseTagPattern = '<!?([\\w-]+)([^<>\\/]*)\\/?>';
const commentPattern = '<!--\\s+(.*?)\\s+-->';
const nonTagPattern = '^((?!<!?[\\w-]+[^<>\\/]+>(?:.*?<[^>]+>)?).)*';
const tagPattern = new RegExp(`${openCloseTagPattern}|${commentPattern}|${selfCloseTagPattern}|${nonTagPattern}`, 'gms');
// const tagPattern = /<([\w-]+)([^<>\/]*)>(.*?)<\/?\1>|<!--\s+(.*?)\s+-->|<!?([\w-]+)([^<>\/]*)\/?>|^((?!<!?[\w-]+[^<>\/]+>(?:.*?<[^>]+>)?).)*/gms;
const attributePattern = /([\#\w]+)(?:=(?="|'[^"]*"|)"([^"]*)")?/g;

class ContextNode {
  #context = {};
  
  constructor(context = {}) {
    this.#context = context;
  }
  
  get context() {
    return Object.freeze(this.#context);
  }
  
  removeContext(key) {
    if (typeof key === 'string') {
      delete this.#context[key];
    }
  }
  
  setContext(key, value = null) {
    if (typeof key === 'string') {
      this.#context[key] = value
    }
  }
}

class TextNode extends ContextNode {
  type = 'TEXT';
  
  constructor(value = '', parentNode = null) {
    super();
    this.name = 'text';
    this.value = value;
    defineGetter(this, 'parentNode', parentNode);
  }
  
  toString() {
    return this.value;
  }
}

class HTMLNode extends ContextNode {
  type = 'HTML';
  #attributes = Object.create(null);
  
  constructor(name, attributesString = '', innerHTML = '', parentNode = null) {
    super();
    
    this.name = name;
    this.parentNode = parentNode;
    this.innerHTML = innerHTML;
    this.childNodes = parseHTMLString(this.innerHTML, this);
    
    for (let [_, key, value] of attributesString.matchAll(attributePattern)) {
      if (value) {
        this.#attributes[key] = value;
      } else {
        this.#attributes[key] = true;
      }
    }
    
    defineGetter(this, 'parentNode', parentNode)
  }
  
  get textContent() {
    return this.innerHTML.replace(/<[^>]*>/g, '');
  }
  
  get attributes() {
    return Object.freeze(this.#attributes);
  }
  
  removeAttribute(key) {
    if (typeof key === 'string') {
      delete this.#attributes[key];
    }
  }
  
  setAttribute(key, value = null) {
    if (typeof key === 'string') {
      this.#attributes[key] = value
    }
  }
  
  toString() {
    return composeTagString(this, this.innerHTML)
  }
}

class CommentNode extends TextNode {
  type = 'COMMENT';
  
  constructor(value, parentNode) {
    super(value, parentNode);
    this.name = 'comment';
  }
  
  toString() {
    return `<!-- ${super.toString()} -->`;
  }
}

class Document extends HTMLNode {
  type = 'DOCUMENT';
  
  constructor(innerHTML) {
    super(null, '', innerHTML, null)
    this.name = 'document';
  }
  
  toString() {
    return this.innerHTML;
  }
}

function parseHTMLString(htmlString, parentNode = null) {
  if (!htmlString || !htmlString.trim()) {
    return []
  }
  
  htmlString = htmlString.trim();
  
  const tags = [];
  
  for (let match of htmlString.matchAll(tagPattern)) {
    if (!match[1] && !match[5]) { // no tag name
      if (match[0].startsWith('<!--')) {
        tags.push(new CommentNode(match[5], parentNode))
      } else {
        tags.push(new TextNode(match[0], parentNode))
      }
    } else if (match[1]) { // open close tag - first part of the pattern
      tags.push(new HTMLNode(match[1], match[2] ?? '', match[3] ?? '', parentNode))
    } else { // self closing tag - last part of the pattern
      tags.push(new HTMLNode(match[5], match[6] ?? '', '', parentNode))
    }
  }
  
  return tags;
}

module.exports.Document = Document;
module.exports.ContextNode = ContextNode;
module.exports.TextNode = TextNode;
module.exports.CommentNode = CommentNode;
module.exports.HTMLNode = HTMLNode;
