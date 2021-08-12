// const {bindData} = require("../utils/bind-data");
// const {handleError} = require("./handle-error");
const {Node} = require('./Node');

// class Text {
//   #data;
//
//   constructor(value, data = {}) {
//     this.value = value;
//     this.#data = data;
//   }
//
//   get type() {
//     return 'text';
//   }
//
//   toString() {
//     try {
//       return bindData(this.value, this.#data);
//     } catch(e) {
//       handleError(e, this);
//     }
//   }
// }

class Text extends Node {
  constructor(value, parentNode) {
    super(parentNode);
    this.value = value;
  }
  
  toString() {
    return this.value;
  }
}

module.exports.Text = Text;
