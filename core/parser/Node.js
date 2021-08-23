class Node {
  #parentNode = null;
  #childNodes = [];
  #context = {};
  #textContent = '';
  
  get parentNode() {
    return this.#parentNode;
  }
  
  set parentNode(value) {
    if (value === null || value instanceof Node) {
      this.#parentNode = value;
    }
  }
  
  get nodeName() {
    return '#node';
  }
  
  get nodeType() {
    return 1
  }
  
  get nodeValue() {
    return null;
  }
  
  get firstChild() {
    return this.#childNodes[0] || null;
  }
  
  get lastChild() {
    return this.#childNodes[this.#childNodes.length - 1] || null;
  }
  
  get childNodes() {
    return [...this.#childNodes];
  }
  
  get textContent() {
    return this.#textContent;
  }
  
  set textContent(value) {
    this.#textContent = value;
    this.#childNodes = [];
  }
  
  get context() {
    return {...this.#parentNode?.context, ...this.#context};
  }
  
  get selfContext() {
    return this.#context;
  }
  
  set context(value) {
    if (value.toString() === '[object Object]') {
      this.#context = value;
    }
  }
  
  get prevSibling() {
    if (this.parentNode) {
      const sibs = this.parentNode.childNodes
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
  
  getRootNode() {
    return this.parentNode ? this.parentNode.getRootNode() : this;
  }
  
  setContext(name, value) {
    if (typeof name === 'string') {
      this.#context[name] = value;
    }
  }
  
  appendChild(node) {
    if (node instanceof Node) {
      node.parentNode = this;
      this.#childNodes.push(node);
    }
  }
  
  removeChild(node) {
    if (node instanceof Node) {
      this.#childNodes.splice(this.#childNodes.indexOf(node), 1);
      node.parentNode = null;
    }
  }
  
  replaceChild(newNode, oldNode) {
    if (newNode instanceof Node && this.#childNodes.includes(oldNode)) {
      this.#childNodes.splice(this.#childNodes.indexOf(oldNode), 1, newNode);
      newNode.parentNode = this;
      oldNode.parentNode = null;
    }
  }
  
  hasChildNodes() {
    return this.#childNodes.length > 0;
  }
  
  insertBefore(newNode, refNode) {
    if (newNode instanceof Node && this.#childNodes.includes(refNode)) {
      this.#childNodes.splice(this.#childNodes.indexOf(refNode), 0, newNode);
      
      newNode.parentNode = this;
    }
  }
}

module.exports.Node = Node;
