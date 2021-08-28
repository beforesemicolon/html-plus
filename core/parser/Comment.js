const {Node} = require('./Node');

/**
 * a simpler server-side DOM comment facade
 */
class Comment extends Node {
  constructor(value) {
    super();
    super.textContent = value.trim();
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
    return `<!-- ${this.textContent} -->`;
  }
  
  appendChild() {}
  
  replaceChild() {}
  
  insertBefore() {}
  
  cloneNode() {
    return new Comment(this.textContent);
  }

}

module.exports.Comment = Comment;
