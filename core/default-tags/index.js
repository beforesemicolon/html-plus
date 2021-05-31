const {Variable} = require("./variable.tag");
const {Fragment} = require("./fragment.tag");
const {Style} = require("./style.tag");
const {Script} = require("./script.tag");
const {Include} = require("./include.tag");
const {Inject} = require("./inject.tag");

module.exports.customTags = [
  Variable,
  Fragment,
  Style,
  Script,
  Include,
  Inject
]