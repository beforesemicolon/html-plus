const fs = require('fs');
const path = require('path');

/**
 * reads file content synchronously
 * @param fileAbsolutePath
 * @returns {string}
 */
function readFileContent(fileAbsolutePath) {
  return fs.readFileSync(path.resolve(__dirname, fileAbsolutePath), 'utf8');
}

module.exports.readFileContent = readFileContent;
