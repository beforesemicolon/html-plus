const {Registry} = require('./../Registry');

class CustomTagsRegistry extends Registry {}

module.exports.customTagsRegistry = new CustomTagsRegistry();
