const {turnCamelOrPascalToKebabCasing} = require("../../utils/turn-camel-or-pascal-to-kebab-casing");
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

const defaultAttributesName = [];
const defaultAttributesMap = {}

for (let attribute of defaultAttributes) {
  const attr = turnCamelOrPascalToKebabCasing(attribute.name);
  defaultAttributesMap[attr] = attribute;
  defaultAttributesName.push(attr);
}

module.exports.defaultAttributesMap = defaultAttributesMap;
module.exports.defaultAttributes = defaultAttributes;
module.exports.defaultAttributesName = defaultAttributesName;
module.exports.If = If;
module.exports.Repeat = Repeat;
module.exports.Attr = Attr;
module.exports.Ignore = Ignore;
module.exports.Fragment = Fragment;

