const fs = require('fs');
const path = require('path');
const {promisify} = require('util');

const lstat = promisify(fs.lstat);
const readDir = promisify(fs.readdir);

async function getDirectoryFilesDetail(src, types = []) {
  types = Array.isArray(types) ? types : types.split(',').map(type => type.trim());
  const filePaths = [];
  
  const traverseDirectory = (dirPath) => {
    return readDir(path.resolve(__dirname, dirPath), 'utf8')
      .then(async (items) => {
        
        for (const item of items) {
          const itemPath = dirPath + '/' + item;
          const itemRelativePath = itemPath.replace(src, '');
          
          try {
            const stat = await lstat(itemPath);
            
            if (stat.isDirectory()) {
              await traverseDirectory(itemPath);
            } else if (!types.length || types.some(type => item.endsWith(type))) {
              filePaths.push({item, itemPath, itemRelativePath, ext: path.extname(item)});
            }
          } catch (e) {
            console.error(e);
            console.error('failed to get stat ', itemPath);
          }
        }
        
        return filePaths
      })
      .catch(e => {
        console.error('failed to read dir ', dirPath);
      });
  };
  
  return traverseDirectory(src);
}

module.exports.getDirectoryFilesDetail = getDirectoryFilesDetail;