const {turnCamelOrPascalToKebabCasing} = require("../utils/turn-camel-or-pascal-to-kebab-casing");
const {Variable} = require("./variable.tag");
const {Fragment} = require("./fragment.tag");
const {Include} = require("./include.tag");
const {Inject} = require("./inject.tag");
const {Log} = require("./log.tag");
const {Ignore} = require("./ignore.tag");

const defaultTags = [
  Variable,
  Fragment,
  Include,
  Inject,
  Log,
  Ignore
];

const defaultTagsName = defaultTags.map(attr => turnCamelOrPascalToKebabCasing(attr.name));

const defaultTagsMap = defaultTags.reduce((acc, tag) => {
  const tagName = turnCamelOrPascalToKebabCasing(tag.name);
  acc[tagName] = tag;
  return acc;
}, {});


module.exports.defaultTags = defaultTags;
module.exports.defaultTagsMap = defaultTagsMap;
module.exports.defaultTagsName = defaultTagsName;