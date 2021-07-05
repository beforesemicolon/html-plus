const fs = require('fs');
const path = require('path');
const {promisify} = require('util');

const lstat = promisify(fs.lstat);
const readDir = promisify(fs.readdir);

const shouldIncludeFile = types => {
  if (typeof types === 'function') return types;
  
  const pattern = new RegExp(`\\.${(Array.isArray(types)
    ? types
    : types.split(',').map(type => type.trim())).join('|')}$`);
  
  return (filePath) => !types.length || pattern.test(filePath)
}

async function getDirectoryFilesDetail(src, types = []) {
  const isNeededFile = shouldIncludeFile(types)
  const filePaths = [];
  
  const traverseDirectory = (dirPath) => {
    return readDir(path.resolve(__dirname, dirPath), 'utf8')
      .then(async (items) => {
        for (const item of items) {
          const itemPath = dirPath + '/' + item;
          
          try {
            const stat = await lstat(itemPath);
            
            if (stat.isDirectory()) {
              await traverseDirectory(itemPath);
            } else if (isNeededFile(itemPath)) {
              filePaths.push({
                item,
                itemPath,
                itemRelativePath: itemPath.replace(src, ''),
                ext: path.extname(item)
              });
            }
          } catch (e) {}
        }
        
        return filePaths
      })
  };
  
  return traverseDirectory(src);
}

module.exports.getDirectoryFilesDetail = getDirectoryFilesDetail;