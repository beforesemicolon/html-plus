const {PartialFile} = require("../PartialFile");

function extractPartialAndPageRoutes(files, pagesDirectoryPath) {
  const partialFileNames = new Set();
  
  return files.reduce((acc, file) => {
    if (file.item.startsWith('_')) {
      if (partialFileNames.has(file.item)) {
          throw new Error(`You have duplicated partial "${file.item}". Partial file names must be unique.`);
      }
      
      acc.partials.push(new PartialFile(file.itemPath, pagesDirectoryPath));
      partialFileNames.add(file.item);
    } else {
      const template = `${file.itemRelativePath.replace(file.ext, '')}`.slice(1);
      
      if (file.itemRelativePath.endsWith('index.html')) {
        acc.pagesRoutes[file.itemRelativePath.replace('index.html', '')] = template;
      } else {
        acc.pagesRoutes[file.itemRelativePath.replace(file.ext, '')] = template;
      }
      
      acc.pagesRoutes[file.itemRelativePath.replace(/\/$/, '')] = template;
    }
    
    return acc;
  }, {partials: [], pagesRoutes: {}});
}

module.exports.extractPartialAndPageRoutes = extractPartialAndPageRoutes;