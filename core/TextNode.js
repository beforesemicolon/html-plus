const {bindData} = require("./utils/bind-data");

class TextNode {
  constructor(node, data = {}) {
    this.value = node.rawText;
    
    if (node.rawText.trim()) {
      this.value = bindData(this.value, data);
      
      if (this.value === 'true') {
        this.value = true
      } else if (this.value === 'false') {
        this.value = false
      } else if (!isNaN(Number(this.value))) {
        this.value = Number(this.value);
      }
  
      node.rawText = this.value;
    }
  }
}

module.exports.TextNode = TextNode;