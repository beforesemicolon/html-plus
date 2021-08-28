const path = require('path');
const {transformFile} = require("../transformers");
const {File} = require("../parser/File");

const styleExtensions = new Set([
  '.scss',
  '.sass',
  '.css',
  '.less',
  '.styl',
]);

/**
 * takes a valid CSS file path and transforms it which
 * calls the "transformFile" function which imports the file
 * and compiles it to raw CSS
 * @param styleFileFullPath
 * @returns {Promise<*|undefined>}
 */
async function importStyle(styleFileFullPath) {
  const ext = path.extname(styleFileFullPath);
  
  if (styleExtensions.has(ext)) {
    return await transformFile(new File(styleFileFullPath));
  }
  
  throw new Error(`Invalid style file extension: ${styleFileFullPath}`)
}

module.exports.importStyle = importStyle;
