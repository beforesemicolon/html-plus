const {PartialFile} = require("../PartialFile");

function extractPartialAndPageRoutes(files, pagesDirectoryPath) {
  return files.reduce((acc, file) => {
    if (file.item.startsWith('_')) {
      acc.partials.push(new PartialFile(file.itemPath, pagesDirectoryPath))
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