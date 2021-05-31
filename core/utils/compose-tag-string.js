const selfClosingTags = require('./selfClosingTags.json');

const globalAttributes = {
  inject: 'inject',
  if: 'if',
  repeat: 'repeat',
  fragment: 'fragment',
}

function composeTagString(node = {}, content = '', specialAttributes = {}) {
  let attributesList = [];
  const {attributes = {}, tagName = 'un-named'} = node;
  
  if (!/^[a-zA-Z][a-zA-Z0-9-]*$/.test(tagName)) {
      throw new Error(`Tag name "${tagName}" is invalid! Tags must start with a letter and can be optionally followed by letters, numbers and dashes.`)
  }
  
  for (let key in attributes) {
    if (attributes.hasOwnProperty(key) && !specialAttributes.hasOwnProperty(key) && !globalAttributes.hasOwnProperty(key)) {
      if (attributes[key]) {
        attributesList.push(`${key}="${attributes[key]}"`);
      } else {
        attributesList.push(key);
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