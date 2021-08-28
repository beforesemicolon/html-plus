const {turnCamelOrPascalToKebabCasing} = require("../../utils/turn-camel-or-pascal-to-kebab-casing");
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

const defaultTagsName = [];
const defaultTagsMap = {};

for (let tag of defaultTags) {
  const tagName = turnCamelOrPascalToKebabCasing(tag.name);
  defaultTagsMap[tagName] = tag;
  defaultTagsName.push(tagName);
}

module.exports.defaultTags = defaultTags;
module.exports.defaultTagsMap = defaultTagsMap;
module.exports.defaultTagsName = defaultTagsName;
module.exports.Variable = Variable;
module.exports.Fragment = Fragment;
module.exports.Include = Include;
module.exports.Inject = Inject;
module.exports.Log = Log;
