const {bindData} = require("./bind-data");
const {executeCode} = require("./execute-code");

/**
 * process CustomAttribute properties
 * @param attr
 * @param val
 * @param data
 * @returns {*}
 */
function processCustomAttributeValue(attr, val, data) {
  if (typeof attr.process === 'function') {
    val = attr.process(val);
  }
  
  if (attr.bind) {
    val = bindData(val, data);
  }
  
  if (attr.execute) {
    val = executeCode(val, data);
  }
  
  return val;
}

module.exports.processCustomAttributeValue = processCustomAttributeValue;
