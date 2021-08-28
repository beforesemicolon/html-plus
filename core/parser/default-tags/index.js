const {turnCamelOrPascalToKebabCasing} = require("../../utils/turn-camel-or-pascal-to-kebab-casing");
const {customTagsRegistry} = require("./CustomTagsRegistry");
const {Variable} = require("./variable.tag");
const {Fragment} = require("./fragment.tag");
const {Include} = require("./include.tag");
const {Inject} = require("./inject.tag");
const {Log} = require("./log.tag");
const {Ignore} = require("./ignore.tag");
const {Style} = require("./style.tag");
const {Script} = require("./script.tag");

const defaultTags = [
  Style,
  Script,
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
  customTagsRegistry.define(tagName, tag);
}


module.exports.customTagsRegistry = customTagsRegistry;
module.exports.defaultTags = defaultTags;
module.exports.defaultTagsMap = defaultTagsMap;
module.exports.defaultTagsName = defaultTagsName;
module.exports.Style = Style;
module.exports.Script = Script;
module.exports.Variable = Variable;
module.exports.Fragment = Fragment;
module.exports.Include = Include;
module.exports.Inject = Inject;
module.exports.Log = Log;
