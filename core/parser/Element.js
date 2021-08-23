const {Text} = require('./Text');
const {Comment} = require('./Comment');
const {Node} = require('./Node');
const {Attributes} = require('./Attributes');
const {Attr} = require('./Attr');
const {tagCommentPattern, attrPattern} = require('./utils/regexPatterns');
const selfClosingTags = require('./utils/selfClosingTags.json');

class Element extends Node {
  #tagName;
  #attributes;
  #children = [];
  
  constructor(tagName = null) {
    super();
    this.#tagName = tagName;
    this.#attributes = new Attributes();
  }
  
  get tagName() {
    return this.#tagName;
  }
  
  get nodeName() {
    return this.tagName?.toUpperCase();
  }
  
  get attributes() {
    return this.#attributes;
  }
  
  get children() {
    return [...this.#children];
  }
  
  get innerHTML() {
    return this.childNodes.join('');
  }
  
  set innerHTML(value) {
    this.#children = [];
    
    for (let childNode of this.childNodes) {
      this.removeChild(childNode);
    }
    
    parseHTMLString(value).childNodes.forEach(node => this.appendChild(node));
  }
  
  set textContent(value) {
    super.textContent = value.replace(tagCommentPattern, '');
    this.#children = [];
    
    for (let childNode of this.childNodes) {
      this.removeChild(childNode);
    }
    
    this.appendChild(new Text(super.textContent))
  }
  
  get textContent() {
    return this.childNodes.join('').replace(tagCommentPattern, '');
  }
  
  get outerHTML() {
    return this.toString();
  }
  
  get prevElementSibling() {
    if (this.parentNode) {
      const sibs = this.parentNode.children
      return sibs[sibs.indexOf(this) - 1] || null;
    }
    
    return null;
  }
  
  get nextElementSibling() {
    if (this.parentNode) {
      const sibs = this.parentNode.children
      return sibs[sibs.indexOf(this) + 1] || null;
    }
    
    return null;
  }
  
  hasAttributes() {
    return this.attributes.length > 0;
  }
  
  hasAttribute(name) {
    return this.attributes.getNamedItem(name) !== null;
  }
  
  setAttribute(name, value = null) {
    if (typeof name === 'string') {
      if (this._customAttributes && this._customAttributes.hasOwnProperty(name)) {
        this._customAttributes.set(name, value);
      }
  
      this.#attributes.setNamedItem(name, value);
    }
  }
  
  setAttributeNode(attr) {
    if (attr instanceof Attr) {
      this.setAttribute(attr.name, attr.value);
    }
  }
  
  getAttributeNames() {
    return [...this.attributes].map(attr => attr.name);
  }
  
  getAttribute(name) {
    if (this._customAttributes && this._customAttributes.has(name)) {
      return this._customAttributes.get(name);
    }
    
    return this.getAttributeNode(name)?.value ?? null;
  }
  
  getAttributeNode(name) {
    if (this._customAttributes && this._customAttributes.has(name)) {
      return new Attr(name, this._customAttributes.get(name));
    }
    
    return this.attributes.getNamedItem(name)
  }
  
  removeAttribute(name) {
    if (this._customAttributes && this._customAttributes.has(name)) {
      this._customAttributes.delete(name);
    }
    
    this.#attributes.removeNamedItem(name);
  }
  
  removeAttributeNode(attr) {
    if (attr instanceof Attr) {
      this.removeAttribute(attr.name)
    }
  }
  
  appendChild(node) {
    if (isValidNode(node)) {
      super.appendChild(node);
      
      if (node instanceof Element) {
        this.#children.push(node);
      }
    }
  }
  
  removeChild(node) {
    if (isValidNode(node)) {
      super.removeChild(node);
      
      if (node instanceof Element) {
        this.#children.splice(this.#children.indexOf(node), 1);
      }
    }
  }
  
  remove() {
    if (this.parentNode) {
      this.parentNode.removeChild(this);
    }
  }
  
  replaceChild(newNode, oldNode) {
    if (isValidNode(newNode) && isValidNode(oldNode)) {
      super.replaceChild(newNode, oldNode);
      
      if (newNode instanceof Element) {
        this.#children.splice(this.#children.indexOf(oldNode), 1, newNode);
      }
    }
  }
  
  cloneNode(deep = false) {
    const cloneNode = new Element(this.tagName);
    
    for (let attribute of this.attributes) {
      cloneNode.setAttribute(attribute.name, attribute.value)
    }
    
    cloneNode.context = {...this.selfContext};
    
    if (deep) {
      this.childNodes.forEach(child => {
        child.context = {...this.selfContext};
        cloneNode.appendChild(child.cloneNode(deep))
      });
    }
    
    return cloneNode;
  }
  
  before(node) {
    if (isValidNode(node) && this.parentNode) {
      this.parentNode.insertBefore(node, this);
    }
  }
  
  after(node) {
    if (isValidNode(node) && this.parentNode) {
      if (this.nextSibling) {
        this.parentNode.insertBefore(node, this.nextSibling);
      } else {
        this.parentNode.appendChild(node);
      }
    }
  }
  
  insertBefore(newNode, refNode) {
    if (isValidNode(newNode) && isValidNode(refNode)) {
      super.insertBefore(newNode, refNode)
      
      if (newNode instanceof Element) {
        this.#children.splice(this.#children.indexOf(refNode), 0, newNode);
      }
    }
  }
  
  #insert(position, node) {
    switch (position) {
      case 'beforebegin':
        this.before(node);
        break;
      case 'afterbegin':
        if (this.firstChild) {
          this.insertBefore(node, this.firstChild);
        } else {
          this.appendChild(node);
        }
        break;
      case 'beforeend':
        this.appendChild(node);
        break;
      case 'afterend':
        this.after(node);
        break;
    }
  }
  
  insertAdjacentElement(position, node) {
    if (node instanceof Element) {
      this.#insert(position, node);
    }
  }
  
  insertAdjacentText(position, value) {
    if (typeof value === "string") {
      const node = new Text(value);
      this.#insert(position, node);
    }
  }
  
  insertAdjacentHTML(position, value) {
    if (typeof value === "string") {
      parseHTMLString(value).childNodes.forEach(node => this.#insert(position, node));
    }
  }
  
  toString() {
    if (this.tagName === null) {
      return this.childNodes.join('');
    }
    
    let tag = `<${this.tagName} ${this.#attributes}`.trimRight();
    
    if (selfClosingTags[this.tagName]) {
      tag += '>'
    } else {
      tag += `>${this.childNodes.join('')}</${this.tagName}>`;
    }
    
    return tag;
  }
}

function isValidNode(node) {
  return node && node instanceof Node;
}

function parseHTMLString(markup, data = {}) {
  const root = new Element();
  root.context = data;
  const stack = [root];
  let match;
  let lastIndex = 0;
  
  while ((match = tagCommentPattern.exec(markup)) !== null) {
    const [fullMatch, comment, closeOrBangSymbol, tagName, attributes, selfCloseSlash] = match;
    
    const parentNode = stack[stack.length - 1] || null;
    
    // grab in between text
    if (lastIndex !== match.index) {
      parentNode.appendChild(new Text(markup.slice(lastIndex, match.index)));
    }
    
    lastIndex = tagCommentPattern.lastIndex;
    
    if (comment) {
      parentNode.appendChild(new Comment(comment));
      continue;
    }
    
    if (closeOrBangSymbol === '!' || selfCloseSlash || selfClosingTags[tagName]) {
      const node = new Element(`${closeOrBangSymbol || ''}${tagName}`);
      
      let match = '';
      while ((match = attrPattern.exec(attributes))) {
        node.setAttribute(match[1], match[2] || match[3] || match[4] || null);
      }
      
      parentNode.appendChild(node);
    } else if (closeOrBangSymbol === '/' && stack[stack.length - 1].tagName === tagName) {
      stack.pop();
    } else if(!closeOrBangSymbol) {
      const node = new Element(tagName);
      
      let match = '';
      while ((match = attrPattern.exec(attributes))) {
        node.setAttribute(match[1], match[2] || match[3] || match[4] || null);
      }
      
      parentNode.appendChild(node);
      
      stack.push(node)
    }
  }
  
  // grab ending text
  if (lastIndex < markup.length) {
    root.appendChild(new Text(markup.slice(lastIndex)));
  }
  
  return root;
}

module.exports.parseHTMLString = parseHTMLString;
module.exports.Element = Element;

