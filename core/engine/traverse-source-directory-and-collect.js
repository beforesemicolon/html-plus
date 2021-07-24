const {PartialFile} = require("../PartialFile");
const path = require('path');

function traverseSourceDirectoryAndCollect(pagesDirectoryPath, partials, pagesRoutes) {
  return filePath => {
    if (filePath.endsWith('.html')) {
      const fileName = path.basename(filePath);
    
      if (fileName.startsWith('_')) {
        partials.push(new PartialFile(filePath, pagesDirectoryPath));
      } else {
        filePath = filePath.replace(pagesDirectoryPath, '');
        const template = `${filePath.replace('.html', '')}`.slice(1);
        let tempPath;
      
        if (filePath.endsWith('index.html')) {
          tempPath = filePath.replace('/index.html', '');
          pagesRoutes[tempPath || '/'] = template;
          pagesRoutes[`${tempPath}/`] = template;
          pagesRoutes[`${tempPath}/index.html`] = template;
        } else {
          tempPath = filePath.replace('.html', '');
          pagesRoutes[tempPath] = template;
          pagesRoutes[`${tempPath}/`] = template;
        }
      }
    }
  
    return false;
  }
}

module.exports.traverseSourceDirectoryAndCollect = traverseSourceDirectoryAndCollect;
