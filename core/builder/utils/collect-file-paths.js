const {PartialFile} = require("../../PartialFile");
const {uniqueAlphaNumericId} = require("../../utils/unique-alpha-numeric-id");
const path = require('path');

function collectFilePaths(pagesDirectoryPath, {partials, pages, resources}) {
  return (filePath) => {
    if (/\.html$/.test(filePath)) {
      const fileName = path.basename(filePath);
      
      if (fileName.startsWith('_')) {
        partials.push(new PartialFile(filePath, pagesDirectoryPath));
      } else {
        pages.push(filePath)
      }
    } else if(!path.basename(filePath).startsWith('_')) {
      resources[filePath] = {
        path: filePath,
        hash: uniqueAlphaNumericId(8)
      }
    }
    
    return false;
  }
}

module.exports.collectFilePaths = collectFilePaths;