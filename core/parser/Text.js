const {Node} = require('./Node');
const {tagCommentPattern} = require("./utils/regexPatterns");

class Text extends Node {
  constructor(value) {
    super();
    super.textContent = value.replace(tagCommentPattern, '');
  }
  
  get nodeName() {
    return '#text';
  }
  
  get nodeType() {
    return 3
  }
  
  get nodeValue() {
    return super.textContent;
  }
  
  set textContent(value) {
    super.textContent = value;
    super.appendChild(new Text(this.nodeValue))
  }
  
  get textContent() {
    return super.textContent;
  }
  
  toString() {
    return this.textContent;
  }
  
  appendChild() {}
  
  replaceChild() {}
  
  insertBefore() {}
  
  cloneNode() {
    return new Text(this.textContent);
  }
}

module.exports.Text = Text;
