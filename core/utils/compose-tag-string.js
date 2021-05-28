const selfClosingTags = require('../selfClosingTags.json');
const specialAttributes = require('../specialAttributes.json');

function composeTagString(node, content = '') {
  let attributesList = [];
  
  for (let key in node.attributes) {
    if (node.attributes.hasOwnProperty(key) && !specialAttributes.hasOwnProperty(key)) {
      attributesList.push(`${key}="${node.attributes[key]}"`);
    }
  }
  
  let markup = `<${node.tagName}${attributesList.length ? ' ' + attributesList.join(' ') : ''}`;
  
  if (selfClosingTags.includes(node.tagName)) {
    markup += '/>';
  } else {
    markup += `>${content}</${node.tagName}>`;
  }
  
  return markup;
}

module.exports.composeTagString = composeTagString;