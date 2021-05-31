const {Tag} = require('./core/Tag');
const {engine} = require("./core/engine");
const {transform} = require('./core/transform');
const {File} = require('./core/File');
const {transform: transformSource} = require('./core/transformers');
const {composeTagString} = require('./core/utils/compose-tag-string');
const {renderChildren} = require('./core/utils/render-children');
const {PartialFile} = require('./core/PartialFile');

module.exports.Tag = Tag;
module.exports.File = File;
module.exports.PartialFile = PartialFile;
module.exports.engine = engine;
module.exports.transform = {
  html: transform,
  ...transformSource
};
module.exports.composeTagString = composeTagString;
module.exports.renderChildren = renderChildren;
