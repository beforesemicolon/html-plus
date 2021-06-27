const selfClosingTags = require('./selfClosingTags.json');
const attr = require("../default-attributes");

function composeTagString(node, content = '', excludedAttributes = []) {
  if (!node || typeof node !== 'object') {
      throw new Error('composeTagString first argument must be HTMLNode or HTMLNode-like object')
  }
  
  const customAttrs = new Set([...attr.defaultAttributesName, ...Object.keys(node._options?.customAttributes ?? {})]);
  let attributesList = [];
  const attributes = node.attributes ?? {};
  const tagName = (node.tagName || 'un-named').toLowerCase();
  
  if (!/^[a-zA-Z][a-zA-Z0-9-]*$/.test(tagName)) {
      throw new Error(`Tag name "${tagName}" is invalid! Tags must start with a letter and can be optionally followed by letters, numbers and dashes.`)
  }
  
  for (let key in attributes) {
    if (attributes.hasOwnProperty(key) && !excludedAttributes.includes(key)) {
      if (attributes[key]) {
        const val = attributes[key];
        key = customAttrs.has(key) ? `#${key}` : key;
        attributesList.push(`${key}="${val}"`);
      } else {
        key = customAttrs.has(key) ? `#${key}` : key;
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