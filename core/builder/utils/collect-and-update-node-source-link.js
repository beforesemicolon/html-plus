const {getFileSourceHashedDestPath} = require("./get-file-source-hashed-dest-path");
const {uniqueAlphaNumericId} = require("../../utils/unique-alpha-numeric-id");
const path = require('path');

function collectAndUpdateNodeSourceLink(node, pageFile, resources, fileDirPath) {
  let srcPath = '';
  let srcAttrName = '';
  
  switch (node.tagName) {
    case 'link':
    case 'area':
    case 'image':
      srcPath = node.attributes.href;
      srcAttrName = 'href';
      break;
    case 'script':
    case 'img':
    case 'audio':
    case 'track':
    case 'video':
    case 'embed':
    case 'iframe':
    case 'portal':
      srcPath = node.attributes.src;
      srcAttrName = 'src';
      break;
    case 'source':
      if (node.attributes.src) {
        srcPath = node.attributes.src;
        srcAttrName = 'src';
      } else if (node.attributes.srcset) {
        srcPath = node.attributes.srcset;
        srcAttrName = 'srcset';
      }
      break;
    case 'object':
      srcPath = node.attributes.data;
      srcAttrName = 'data';
      break;
    default:
  }
  
  let isURL = false;
  
  try {
    new URL(srcPath);
    isURL = true;
  } catch (e) {
  }
  
  if (srcPath && typeof srcPath === 'string' && !isURL) {
    if (/node_modules\//.test(srcPath)) {
      srcPath = srcPath.replace(/^.+(?=node_modules)/, `${process.cwd()}/`);
    } else {
      srcPath = path.resolve(pageFile.fileDirectoryPath, srcPath);
    }
    
    if (!resources[srcPath]) {
      resources[srcPath] = {
        path: srcPath,
        hash: uniqueAlphaNumericId(8)
      }
    }
    
    const srcDestPath = getFileSourceHashedDestPath(srcPath, resources[srcPath].hash);
    const relativePath = path.relative(fileDirPath, pageFile.srcDirectoryPath);

    node.setAttribute(srcAttrName, `${relativePath || '.'}/${srcDestPath}`);
    
    return {srcPath, srcDestPath, pageFile};
  }
  
  return null;
}

module.exports.collectAndUpdateNodeSourceLink = collectAndUpdateNodeSourceLink;