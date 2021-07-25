const {mergeObjects} = require("./merge-objects");
const path = require('path');

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
