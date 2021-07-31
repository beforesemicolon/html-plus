const path = require('path');
const {transformFile} = require("../transformers");
const {File} = require("../File");

const styleExtensions = new Set([
  '.scss',
  '.sass',
  '.css',
  '.less',
  '.styl',
]);

async function importStyle(styleFileFullPath) {
  const ext = path.extname(styleFileFullPath);
  
  if (styleExtensions.has(ext)) {
    return await transformFile(new File(styleFileFullPath));
  }
  
  throw new Error(`Invalid style file extension: ${styleFileFullPath}`)
}

module.exports.importStyle = importStyle;
