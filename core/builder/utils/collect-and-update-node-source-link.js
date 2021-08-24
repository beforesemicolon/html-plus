const {getFileSourceHashedDestPath} = require("./get-file-source-hashed-dest-path");
const {uniqueAlphaNumericId} = require("../../utils/unique-alpha-numeric-id");
const path = require('path');
const validUrl = require("valid-url");

const resourceType = {
  'link': 'link',
  'image': 'image',
  'img': 'image',
  'audio': 'media',
  'video': 'media',
  'track': 'media',
  'source': 'media',
  'script': 'script',
  'object': 'object'
}

function collectAndUpdateNodeSourceLink(node, pageFile, resources, fileDirPath) {
  let srcPath = '';
  let srcAttrName = '';
  
  switch (node.tagName) {
    case 'link':
    case 'image':
      srcPath = node.getAttribute('href');
      srcAttrName = 'href';
      break;
    case 'script':
    case 'img':
    case 'audio':
    case 'track':
    case 'video':
      srcPath = node.getAttribute('src');
      srcAttrName = 'src';
      break;
    case 'source':
      if (node.hasAttribute('src')) {
        srcPath = node.getAttribute('src');
        srcAttrName = 'src';
      } else if (node.hasAttribute('srcset')) {
        srcPath = node.getAttribute('srcset');
        srcAttrName = 'srcset';
      }
      break;
    case 'object':
      srcPath = node.getAttribute('data');
      srcAttrName = 'data';
      break;
    default:
  }
  
  if (srcPath && typeof srcPath === 'string' && !validUrl.isUri(srcPath)) {
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
    
    let type = resourceType[node.tagName];
    
    if (type === 'link') {
      const rel = node.getAttribute('rel');
  
      if (/preload|prefetch|prerender|preconnect/.test(rel)) {
        const as = node.getAttribute('as');
        type = as || type;
      } else {
        type = rel || type;
      }
    }
    
    return {srcPath, srcDestPath, pageFile, type};
  }
  
  return null;
}

module.exports.collectAndUpdateNodeSourceLink = collectAndUpdateNodeSourceLink;
