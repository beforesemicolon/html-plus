const fs = require('fs');
const path = require('path');
const {promisify} = require('util');

const lstat = promisify(fs.lstat);
const readDir = promisify(fs.readdir);

/**
 * reads a directory recursively collecting files and directories
 * and returns an array of files objects with file info
 * based on the list of file extension specified
 * @param src
 * @param types
 * @returns {Promise<*[]>}
 */
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
          } catch (e) {
          }
        }
        
        return filePaths
      })
  };
  
  return traverseDirectory(src);
}

/**
 * small util that takes a list of file extensions or a callback function
 * and returns a function that consumes a file path and return TRUE or FALSE
 * whether the file should be collected/included or not by getDirectoryFilesDetail function
 * @param types
 * @returns {(function(*=))|*}
 */
const shouldIncludeFile = types => {
  // if the types is already a function
  // it is because the user wants to manually check for the file type
  if (typeof types === 'function') return types;
  
  // build a regex pattern base on the list of file extension list
  const pattern = new RegExp(`\\.${(
      // types can be an array of types or a string of types separated by comma
      Array.isArray(types) ? types : types.split(',').map(type => type.trim())
      ).join('|')}$`);
  
  return (filePath) => !types.length || pattern.test(filePath)
}

module.exports.getDirectoryFilesDetail = getDirectoryFilesDetail;
