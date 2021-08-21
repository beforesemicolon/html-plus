const {bindData} = require("./bind-data");
const {executeCode} = require("./execute-code");

function processCustomAttributeValue(attr, val, data) {
  if (typeof attr.process === 'function') {
    val = attr.process(val);
  }
  
  if (attr.execute) {
    val = executeCode(`(() => (${val}))()`, data);
  } else {
    val = bindData(val, data);
  }
  
  return val;
}

module.exports.processCustomAttributeValue = processCustomAttributeValue;
