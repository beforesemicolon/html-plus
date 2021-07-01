const {PartialFile} = require("../PartialFile");

function extractPartials(files, pagesDirectoryPath) {
  const partialFileNames = new Set();
  
  return files.reduce((acc, file) => {
    if (file.item.startsWith('_')) {
      if (partialFileNames.has(file.item)) {
          throw new Error(`You have duplicated partial "${file.item}". Partial file names must be unique.`);
      }
      
      acc.push(new PartialFile(file.itemPath, pagesDirectoryPath));
      partialFileNames.add(file.item);
    }
    
    return acc;
  }, []);
}

module.exports.extractPartials = extractPartials;