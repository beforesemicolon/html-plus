const {Node} = require('./Node');

class Text extends Node {
  constructor(value) {
    super();
    this.value = value;
  }
  
  toString() {
    return this.value;
  }
}

module.exports.Text = Text;
