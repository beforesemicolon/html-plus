const {Node} = require('./Node');
const {tagPattern} = require("./utils/regexPatterns");

class Text extends Node {
  constructor(value) {
    super();
    super.textContent = value.replace(tagPattern, '');
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
    return this.nodeValue;
  }
  
  appendChild() {}
  
  replaceChild() {}
  
  insertBefore() {}
  
  cloneNode(deep = false) {
    return new Text(deep ? this.nodeValue : '');
  }
}

module.exports.Text = Text;
