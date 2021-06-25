const {undoSpecialCharactersInHTML} = require("./utils/undo-special-characters-in-HTML");
const {processCustomAttributeValue} = require("./utils/process-custom-attribute-value");
const {defaultAttributesName} = require("../default-attributes");

function renderByAttribute(node, options) {
  const customAttrs = new Set([...defaultAttributesName, ...Object.keys(options.customAttributes)]);
  
  for (let attr of customAttrs) {
    if (node.attributes.hasOwnProperty(attr) && options.customAttributes[attr]) {
      const handler = new options.customAttributes[attr]();
      const data = {$data: options.data, ...node.context};
      let value = node.attributes[attr].trim();
      
      if (value) {
        value = processCustomAttributeValue(handler, undoSpecialCharactersInHTML(node.attributes[attr]), data);
      }
  
      node.removeAttribute(attr)
      
      const result = handler.render(value, node);

      if (!result || typeof result === 'string') {
        return result ?? '';
      }
    }
  }
  
  return node;
}

module.exports.renderByAttribute = renderByAttribute;
