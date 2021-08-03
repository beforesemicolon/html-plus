const tagPattern = /<!--([^]*?(?=-->))-->|<(\/|!)?([a-z][-.:0-9_a-z]*)\s*([^>]*?)(\/?)>/ig;
const attrPattern = /(#?[a-z][a-z0-9-_:]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|(\S+)))?/ig;
const selfClosingPattern = /^area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr|doctype$/i

class Node {
  #parentNode;
  
  constructor(parentNode) {
    this.#parentNode = parentNode;
  }
  
  get parentNode() {
    return this.#parentNode;
  }
}

class HTMLNode extends Node {
  #tagName;
  #attributes = null;
  #attributeString = '';
  #childNodes = [];
  
  constructor(tagName = null, attributeString = '', parentNode = null) {
    super(parentNode);
    this.#tagName = tagName;
    this.#attributeString = attributeString;
  }
  
  get tagName() {
    return this.#tagName;
  }
  
  get attributes() {
    if (!this.#attributes) {
      this.#attributes = {};
      let match;
      while ((match = attrPattern.exec(this.#attributeString))) {
        this.#attributes[match[1]] = match[2] || match[3] || match[4] || null;
      }
    }
    
    return this.#attributes;
  }
  
  get childNodes() {
    return this.#childNodes;
  }
  
  get children() {
    return this.#childNodes.filter(node => node instanceof HTMLNode);
  }
  
  get innerHTML() {
    // to string the childNodes
    return this.#childNodes.join('');
  }
  
  set innerHTML(value) {
    this.#childNodes = html(value).childNodes;
  }
  
  toString() {
    if (this.tagName === null) {
        return this.childNodes.join('');
    }
    
    let tag = `<${this.tagName} `;
  
    tag += this.attributes
      ? Object.entries(this.attributes || {})
        .map(([key, val]) => {
          return val ? `${key}="${val}"` : key;
        })
        .join(' ')
      : '';
    
    if (selfClosingPattern.test(this.tagName)) {
      tag = tag.trim() + '/>'
    } else {
      tag = tag.trim() + `>${this.childNodes.join('')}</${this.tagName}>`;
    }
    
    return tag;
  }
}

class Text extends Node {
  constructor(value, parentNode) {
    super(parentNode);
    this.value = value;
  }
  
  toString() {
    return this.value;
  }
}

class Comment extends Text {
  toString() {
    return `<!-- ${this.value.trim()} -->`;
  }
}

function html(markup) {
  const root = new HTMLNode();
  const stack = [root];
  let match;
  let lastIndex = 0;
  
  while ((match = tagPattern.exec(markup)) !== null) {
    const [tag, comment, closeOrBang, tagName, attributes] = match;
    
    const parentNode = stack[stack.length - 1] || null;
    
    // grab in between text
    if (lastIndex !== match.index) {
      parentNode.childNodes.push(new Text(markup.slice(lastIndex, match.index), parentNode));
    }
    
    lastIndex = tagPattern.lastIndex;
    
    if (comment) {
      parentNode.childNodes.push(new Comment(comment, parentNode));
      continue;
    }
    
    const isSelfClosing = selfClosingPattern.test(tagName);
    const isClosedTag = stack[stack.length - 1].tagName === tagName;
    
    if (isSelfClosing) {
      const node = new HTMLNode(tagName, attributes, parentNode);
      parentNode.childNodes.push(node);
    } else if (isClosedTag) {
      stack.pop();
    } else if (!closeOrBang) {
      const node = new HTMLNode(tagName, attributes, parentNode);
      parentNode.childNodes.push(node);
      stack.push(node)
    }
  }
  
  // grab ending text
  if (lastIndex < markup.length) {
    root.childNodes.push(new Text(markup.slice(lastIndex), root));
  }
  
  return root;
}

module.exports.html = html;
