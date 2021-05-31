const {Attribute} = require("../Attribute");

class If extends Attribute {
  bind = true;
  
  render(tag, value) {
    return value ? tag : null;
  }
}

module.exports.If = If;