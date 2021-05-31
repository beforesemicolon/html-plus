const {If} = require('./if.attribute');

const defaultAttributes = [
  If,
]

const defaultAttributesMap = [...defaultAttributes].reduce((acc, attribute) => {
  const attr = attribute.name[0].toLowerCase() + attribute.name.slice(1);
  acc[attr] = attribute.toString().startsWith('class') ? new attribute() : attribute();
  return acc;
}, {})

module.exports.defaultAttributesMap = defaultAttributesMap;
module.exports.defaultAttributes = defaultAttributes

