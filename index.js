const {HTMLNode} = require("./core/parser/HTMLNode");
const {Attribute} = require('./core/Attribute');
const {engine} = require("./core/engine");
const {transform} = require('./core/transform');
const {File} = require('./core/File');
const {transform: transformSource} = require('./core/transformers');
const {composeTagString} = require('./core/parser/compose-tag-string');
const {PartialFile} = require('./core/PartialFile');

module.exports.Attribute = Attribute;
module.exports.File = File;
module.exports.PartialFile = PartialFile;
module.exports.HTMLNode = HTMLNode;
module.exports.engine = engine;
module.exports.transform = {
  html: transform,
  ...transformSource
};
module.exports.composeTagString = composeTagString;
