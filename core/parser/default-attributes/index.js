const {turnCamelOrPascalToKebabCasing} = require("../../utils/turn-camel-or-pascal-to-kebab-casing");
const {If} = require('./if.attribute');
const {Repeat} = require('./repeat.attribute');
const {Fragment} = require('./fragment.attribute');
const {Ignore} = require('./ignore.attribute');
const {Attr} = require('./attr.attribute');

const defaultAttributes = [
  If,
  Repeat,
  Fragment,
  Attr,
  Ignore,
]

// the order the attributes should be picked on the tag
// will determine how to successfully render the node when multiple of these
// are present on the node
const attrsPriorities = {
  '#if': 1,
  '#repeat': 2,
  '#fragment': 3,
  '#attr': 4,
  '#ignore': 5
}

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
module.exports.attrsPriorities = attrsPriorities;
module.exports.If = If;
module.exports.Repeat = Repeat;
module.exports.Attr = Attr;
module.exports.Ignore = Ignore;
module.exports.Fragment = Fragment;

