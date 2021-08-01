const validUrl = require('valid-url');
const path = require('path');

function traverseNode(pagesDirectoryPath) {
  return (node, nodeFile) => {
    let srcAttrName = '';
    let srcPath = '';
  
    switch (node.tagName) {
      case 'link':
      case 'image':
        srcPath = node.attributes.href;
        srcAttrName = 'href';
        break;
      case 'script':
      case 'img':
      case 'audio':
      case 'track':
      case 'video':
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
    
    if (srcPath && !validUrl.isUri(srcPath)) {
      const resourceFullPath = path.resolve(nodeFile.fileDirectoryPath, srcPath);
      
      if (resourceFullPath.startsWith(pagesDirectoryPath)) {
        const value = resourceFullPath.replace(pagesDirectoryPath, '');
        node.setAttribute(srcAttrName, value)
      }
    }
  }
}

module.exports.traverseNode = traverseNode;
