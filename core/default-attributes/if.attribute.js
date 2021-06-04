const {Attribute} = require("../Attribute");

class If extends Attribute {
  bind = true;
  
  render(condition, node) {
    return condition ? node : null;
  }
}

module.exports.If = If;