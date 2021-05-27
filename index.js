const {Tag} = require('./core/Tag');
const {engine} = require("./core/engine");
const {transform} = require('./core/transform');
const {composeTagString} = require('./core/utils/compose-tag-string');
const {renderChildren} = require('./core/utils/render-children');
const {createPartialFile} = require('./core/utils/create-partial-file');

module.exports.Tag = Tag;
module.exports.engine = engine;
module.exports.transform = transform;
module.exports.composeTagString = composeTagString;
module.exports.renderChildren = renderChildren;
module.exports.createPartialFile = createPartialFile;
