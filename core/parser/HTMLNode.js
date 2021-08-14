const {Text} = require('./Text');
const {Comment} = require('./Comment');
const {Node} = require('./Node');
const {Attributes} = require('./Attributes');
const {Attr} = require('./Attr');
const {selfClosingPattern, tagPattern, specificAttrPattern} = require('./utils/regexPatterns');

class HTMLNode extends Node {
  #tagName;
  #attributes;
  #textContent = '';
  #childNodes = [];
  #children = [];
  
  constructor(tagName = null, attributeString = '') {
    super();
    this.#tagName = tagName;
    this.#attributes = new Attributes(attributeString);
  }
  
  get tagName() {
    return this.#tagName;
  }
  
  get nodeName() {
    return this.#tagName;
  }
  
  get attributes() {
    return this.#attributes;
  }
  
  get childNodes() {
    return Object.freeze([...this.#childNodes]);
  }
  
  get children() {
    return this.#children;
  }
  
  get innerHTML() {
    return this.#childNodes.join('');
  }
  
  set innerHTML(value) {
    this.#children = [];
    this.#childNodes = parseHTMLString(value).childNodes.map(node => {
      node.parentNode = this;
      
      if (node instanceof HTMLNode) {
        this.#children.push(node)
      }
      
      return node;
    });
  }
  
  get outerHTML() {
    return this.toString();
  }
  
  get textContent() {
    return this.#textContent;
  }
  
  set textContent(value) {
    this.#textContent = value.replace(tagPattern, '');
    const content = new Text(this.#textContent);
    content.parentNode = this;
    this.#childNodes = [content];
    this.#children = [];
  }
  
  get prevSibling() {
    if (this.parentNode) {
      const sibs = this.parentNode.childNodes
      return sibs[sibs.indexOf(this) - 1] || null;
    }
    
    return null;
  }
  
  get prevElementSibling() {
    if (this.parentNode) {
      const sibs = this.parentNode.children
      return sibs[sibs.indexOf(this) - 1] || null;
    }
    
    return null;
  }
  
  get nextSibling() {
    if (this.parentNode) {
      const sibs = this.parentNode.childNodes
      return sibs[sibs.indexOf(this) + 1] || null;
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
      
      const currAttr = this.getAttribute(name);
      
      if (currAttr) {
        this.#attributes = new Attributes(this.attributes.toString().replace(currAttr, value))
      } else {
        const attr = value ? `${name}="${value}"` : name;
        this.#attributes = new Attributes(`${this.attributes} ${attr}`)
      }
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
    
    this.#attributes = new Attributes(this.attributes.toString().replace(specificAttrPattern(name), ''))
  }
  
  removeAttributeNode(attr) {
    if (attr instanceof Attr) {
      this.removeAttribute(attr.name)
    }
  }
  
  appendChild(node) {
    if (isValidNode(node)) {
      this.#childNodes.push(node);
      
      if (node instanceof HTMLNode) {
        this.#children.push(node);
      }
      
      node.parentNode = this;
    }
  }
  
  removeChild(node) {
    if (isValidNode(node)) {
      this.#childNodes.splice(this.#childNodes.indexOf(node), 1);
      
      if (node instanceof HTMLNode) {
        this.#children.splice(this.#children.indexOf(node), 1);
      }
      
      node.parentNode = null;
    }
  }
  
  remove() {
    if (this.parentNode) {
      this.parentNode.removeChild(this);
    }
  }
  
  replaceChild(newNode, oldNode) {
    if (isValidNode(newNode) && isValidNode(oldNode)) {
      this.#childNodes.splice(this.#childNodes.indexOf(oldNode), 1, newNode);
      
      if (newNode instanceof HTMLNode) {
        this.#children.splice(this.#children.indexOf(oldNode), 1, newNode);
      }
      
      newNode.parentNode = this;
      oldNode.parentNode = null;
    }
  }
  
  cloneNode(deep = false) {
    const cloneNode = new HTMLNode(this.tagName, this.attributes.toString());
    cloneNode.context = {...this.selfContext};
    
    if (deep) {
      this.childNodes.forEach(child => {
        child.context = {...this.selfContext};
        
        if (child instanceof HTMLNode) {
          cloneNode.appendChild(child.cloneNode(deep))
        } else if (child instanceof Text) {
          cloneNode.appendChild(new Text(child.value))
        } else {
          cloneNode.appendChild(new Comment(child.value))
        }
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
      this.parentNode.insertBefore(node, this.nextSibling);
    }
  }
  
  insertBefore(newNode, refNode) {
    if (isValidNode(newNode) && isValidNode(refNode)) {
      this.#childNodes.splice(this.#childNodes.indexOf(refNode), 0, newNode);
      
      if (newNode instanceof HTMLNode) {
        this.#children.splice(this.#children.indexOf(refNode), 0, newNode);
      }
      
      newNode.parentNode = this;
    }
  }
  
  insertAdjacentElement(position, node) {
    if (node instanceof HTMLNode) {
      switch (position) {
        case 'beforebegin':
          this.before(node);
          break;
        case 'afterbegin':
          this.#childNodes.splice(0, 0, node);
          this.#children.splice(0, 0, node);
          break;
        case 'beforeend':
          this.appendChild(node);
          break;
        case 'afterend':
          this.after(node);
          break;
      }
    }
  }
  
  insertAdjacentText(position, value) {
    if (typeof value === "string") {
      const node = new Text(value);
      
      switch (position) {
        case 'beforebegin':
          this.before(node);
          break;
        case 'afterbegin':
          this.#childNodes.splice(0, 0, node);
          break;
        case 'beforeend':
          this.appendChild(node);
          break;
        case 'afterend':
          this.after(node);
          break;
      }
    }
  }
  
  insertAdjacentHTML(position, value) {
    if (typeof value === "string") {
      parseHTMLString(value).childNodes.forEach(node => {
        switch (position) {
          case 'beforebegin':
            this.before(node);
            break;
          case 'afterbegin':
            this.#childNodes.splice(0, 0, node);
            
            if (node instanceof HTMLNode) {
              this.#children.splice(0, 0, node);
            }
            break;
          case 'beforeend':
            this.appendChild(node);
            break;
          case 'afterend':
            this.after(node);
            break;
        }
      });
    }
  }
  
  toString() {
    if (this.tagName === null) {
      return this.childNodes.join('');
    }
    
    const isSelfClosing = selfClosingPattern.test(this.tagName);
    let tag = `<${/doctype/i.test(this.tagName) ? '!' : ''}${this.tagName} ${this.#attributes}`.trim();
    
    if (isSelfClosing) {
      tag = tag.trim() + '>'
    } else {
      tag = tag.trim() + `>${this.childNodes.join('')}</${this.tagName}>`;
    }
    
    return tag;
  }
}

function isValidNode(node) {
  return node instanceof HTMLNode || node instanceof Text || node instanceof Comment;
}

function parseHTMLString(markup, data = {}) {
  const root = new HTMLNode();
  root.context = data;
  const stack = [root];
  let match;
  let lastIndex = 0;
  
  while ((match = tagPattern.exec(markup)) !== null) {
    const [tag, comment, closeOrBang, tagName, attributes, selfCloseSlash] = match;
    
    const parentNode = stack[stack.length - 1] || null;
    
    // grab in between text
    if (lastIndex !== match.index) {
      parentNode.appendChild(new Text(markup.slice(lastIndex, match.index)));
    }
    
    lastIndex = tagPattern.lastIndex;
    
    if (comment) {
      parentNode.appendChild(new Comment(comment));
      continue;
    }
    
    const isClosedTag = stack[stack.length - 1].tagName === tagName;
    
    if (selfCloseSlash || selfClosingPattern.test(tagName)) {
      parentNode.appendChild(new HTMLNode(tagName, attributes));
    } else if (isClosedTag) {
      stack.pop();
    } else {
      const node = new HTMLNode(tagName, attributes);
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
module.exports.HTMLNode = HTMLNode;
module.exports.Attributes = Attributes;

