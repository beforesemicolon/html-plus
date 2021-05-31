const fs = require('fs');
const path = require('path');

function readFileContent(fileAbsolutePath) {
  return fs.readFileSync(path.resolve(__dirname, fileAbsolutePath), 'utf8');
}

module.exports.readFileContent = readFileContent;