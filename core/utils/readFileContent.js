const fs = require('fs');
const path = require('path');

function readFileContent(fileAbsolutePath) {
  try {
    return fs.readFileSync(path.resolve(__dirname, fileAbsolutePath), 'utf8');
  } catch (e) {
  }
  
  return null;
}

module.exports.readFileContent = readFileContent;