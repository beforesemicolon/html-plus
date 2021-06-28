const {bindData} = require("../utils/bind-data");
const {handleError} = require("./handle-error");

class Text {
  #data;
  
  constructor(value, data = {}) {
    this.value = value;
    this.#data = data;
  }
  
  get type() {
    return 'text';
  }
  
  toString() {
    try {
      return bindData(this.value, this.#data);
    } catch(e) {
      handleError(e, this);
    }
  }
}

module.exports.Text = Text;