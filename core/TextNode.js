const {bindData} = require("./utils/bind-data");

class TextNode {
  constructor(nodeOrText, data = {}) {
    this.value = typeof nodeOrText === 'string'
      ? nodeOrText
      : nodeOrText.rawText;
    
    if (this.value.trim()) {
      this.value = bindData(this.value, data);
      
      if (this.value === 'true') {
        this.value = true
      } else if (this.value === 'false') {
        this.value = false
      } else if (!isNaN(Number(this.value))) {
        this.value = Number(this.value);
      }
  
      if (nodeOrText.rawText) {
        nodeOrText.rawText = this.value;
      }
      
    }
  }
}

module.exports.TextNode = TextNode;