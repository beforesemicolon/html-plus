const {CustomAttribute} = require("./CustomAttribute");

class If extends CustomAttribute {
  execute = true;
  
  render(condition, node) {
    return condition ? node : null;
  }
}

module.exports.If = If;
