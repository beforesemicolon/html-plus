const {processCustomAttributeValue} = require("./process-custom-attribute-value");
const {undoSpecialCharactersInHTML} = require("./undo-special-characters-in-HTML");
const {bindData} = require("./bind-data");
const {isNumber} = require('util');

function processNodeAttributes(attributes = {}, customAttributes = {}, data = {}) {
  
  for (const attrName in attributes) {
    if (attributes.hasOwnProperty(attrName)) {
      let val = (undoSpecialCharactersInHTML(attributes[attrName])).trim();

      if (val) {
        try {
          if (customAttributes[attrName]) {
            const attr = customAttributes[attrName];
  
            val = processCustomAttributeValue(attr, val, data);
          } else {
            val = bindData(val, data)
          }
  
          if (typeof val === 'string') {
            if (val === 'true') {
              val = true
            } else if (val === 'false') {
              val = false
            } else if (val && isNumber(Number(val)) && !isNaN(Number(val))) {
              val = Number(val);
            }
          }
        } catch (e) {
          throw new Error(`Failed to process attribute "${attrName}": ${e.message}`)
        }
      }
      
      attributes[attrName] = val;
    } else {
      delete attributes[attrName];
    }
  }
  
  return attributes;
}

module.exports.processNodeAttributes = processNodeAttributes;