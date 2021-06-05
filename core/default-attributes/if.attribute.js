const {Attribute} = require("../Attribute");

class If extends Attribute {
  execute = true;
  
  render(condition, node) {
    return condition ? node : null;
  }
}

module.exports.If = If;