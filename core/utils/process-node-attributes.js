const {undoSpecialCharactersInHTML} = require("./undo-special-characters-in-HTML");
const {executeCode} = require("./execute-code");
const {bindData} = require("./bind-data");
const {turnKebabToCamelCasing} = require('./turn-kebab-to-camel-casing');
const {isNumber} = require('util');

function processNodeAttributes(node = {}, customAttributes = {}, data = {}) {
  const attributes = node?.attributes ?? {};
  
  for (const attrName in attributes) {
    if (attributes.hasOwnProperty(attrName)) {
      let val = (attributes[attrName].trim());
      
      if (val) {
        try {
          if (customAttributes[attrName]) {
            const attr = customAttributes[attrName];
      
            if (attr.bind) {
              val = executeCode(`(() => (${undoSpecialCharactersInHTML(val)}))()`, data);
            }
      
            if (typeof attr.process === 'function') {
              val = attr.process(val);
            }
          } else {
            val = bindData(val, data)
          }
    
        } catch (e) {
          throw new Error(`Failed to process attribute "${attrName}": ${e.message}`)
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
  
        if (typeof node.setAttribute === 'function') {
          node.setAttribute(attrName, val);
        }
      }
      
      delete attributes[attrName];
      attributes[turnKebabToCamelCasing(attrName)] = val;
  
      if (customAttributes[attrName] && typeof node.removeAttribute === 'function') {
        node.removeAttribute(attrName);
      }
    }
  }
  
  return attributes;
}

module.exports.processNodeAttributes = processNodeAttributes;