const {Node} = require('./Node');

class Comment extends Node {
  constructor(value) {
    super();
    super.textContent = value;
  }
  
  get nodeName() {
    return '#comment';
  }
  
  get nodeType() {
    return 8
  }
  
  get nodeValue() {
    return super.textContent;
  }
  
  set textContent(value) {
    super.textContent = value;
    super.appendChild(new Comment(this.nodeValue))
  }
  
  get textContent() {
    return super.textContent;
  }
  
  toString() {
    return `<!-- ${this.nodeValue} -->`;
  }
  
  appendChild() {}
  
  replaceChild() {}
  
  insertBefore() {}
  
  cloneNode(deep = false) {
    return new Comment(deep ? this.nodeValue : '');
  }

}

module.exports.Comment = Comment;
