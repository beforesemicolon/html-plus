const {turnCamelOrPascalToKebabCasing} = require("../utils/turn-camel-or-pascal-to-kebab-casing");
const {If} = require('./if.attribute');
const {Repeat} = require('./repeat.attribute');
const {Fragment} = require('./fragment.attribute');
const {Ignore} = require('./ignore.attribute');
const {Attr} = require('./attr.attribute');

// the order of this list is essential to make things work
const defaultAttributes = [
  If,
  Repeat,
  Attr,
  Ignore,
  Fragment,
]

const defaultAttributesName = defaultAttributes.map(attr => turnCamelOrPascalToKebabCasing(attr.name));

const defaultAttributesMap = defaultAttributes.reduce((acc, attribute) => {
  const attr = turnCamelOrPascalToKebabCasing(attribute.name);
  acc[attr] = attribute;
  return acc;
}, {})

module.exports.defaultAttributesMap = defaultAttributesMap;
module.exports.defaultAttributes = defaultAttributes;
module.exports.defaultAttributesName = defaultAttributesName;

