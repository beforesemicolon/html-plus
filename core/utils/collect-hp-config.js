const {mergeObjects} = require("./merge-objects");
const path = require('path');

/**
 * collects the config options by looking at the root directory for the "hp.config.js" file
 * deeply merges it with the default options and other user options
 * and returns a new option object to be consumed
 * @param options
 * @param defaultOptions
 * @returns Object
 */
function collectHPConfig(options = {}, defaultOptions = {}) {
  let hbConfig = {};
  
  try {
    hbConfig = require(path.join(process.cwd(), 'hp.config.js'));
  } catch (e) {
    if (e.code !== 'MODULE_NOT_FOUND') {
      e.message = `hp.config.js file loading failed: ${e.message}`
      throw new Error(e)
    }
  }
  
  return {...defaultOptions, ...mergeObjects(hbConfig, options)};
}

module.exports.collectHPConfig = collectHPConfig;
