const selfClosingTags = require('./selfClosingTags.json');
const {turnCamelOrPascalToKebabCasing} = require("./turn-camel-or-pascal-to-kebab-casing");

function composeTagString(node = {}, content = '', excludedAttributes = []) {
  let attributesList = [];
  const attributes = node.attributes;
  const tagName = (node.tagName || 'un-named').toLowerCase();
  
  if (!/^[a-zA-Z][a-zA-Z0-9-]*$/.test(tagName)) {
      throw new Error(`Tag name "${tagName}" is invalid! Tags must start with a letter and can be optionally followed by letters, numbers and dashes.`)
  }
  
  for (let key in attributes) {
    if (attributes.hasOwnProperty(key) && !excludedAttributes.includes(key)) {
      if (attributes[key]) {
        attributesList.push(`${turnCamelOrPascalToKebabCasing(key)}="${attributes[key]}"`);
      } else {
        attributesList.push(turnCamelOrPascalToKebabCasing(key));
      }
    }
  }
  
  let markup = `<${tagName}${attributesList.length ? ' ' + attributesList.join(' ') : ''}`;
  
  if (selfClosingTags.includes(tagName)) {
    markup += '/>';
  } else {
    markup += `>${content}</${tagName}>`;
  }
  
  return markup;
}

module.exports.composeTagString = composeTagString;