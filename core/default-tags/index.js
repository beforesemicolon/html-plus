const {turnCamelOrPascalToKebabCasing} = require("../utils/turn-camel-or-pascal-to-kebab-casing");
const {Variable} = require("./variable.tag");
const {Fragment} = require("./fragment.tag");
const {Style} = require("./style.tag");
const {Script} = require("./script.tag");
const {Include} = require("./include.tag");
const {Inject} = require("./inject.tag");

const defaultTags = [
  Variable,
  Fragment,
  Style,
  Script,
  Include,
  Inject
];

const defaultTagsName = defaultTags.map(attr => attr.name);

const defaultTagsMap = defaultTags.reduce((acc, tag) => {
  const tagName = turnCamelOrPascalToKebabCasing(tag.name);
  acc[tagName] = tag;
  return acc;
}, {});


module.exports.defaultTags = defaultTags;
module.exports.defaultTagsMap = defaultTagsMap;
module.exports.defaultTagsName = defaultTagsName;