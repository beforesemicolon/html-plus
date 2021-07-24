const validUrl = require('valid-url');
const path = require('path');

function traverseNode(pagesDirectoryPath) {
  return (node, nodeFile) => {
    let attrName = '';
    
    if (node.tagName === 'link') {
      attrName = 'href';
    } else if (node.tagName === 'script') {
      attrName = 'src';
    }
    
    const srcPath = node.attributes[attrName];
    
    if (srcPath && !validUrl.isUri(srcPath)) {
      const resourceFullPath = path.resolve(nodeFile.fileDirectoryPath, srcPath);
      
      if (resourceFullPath.startsWith(pagesDirectoryPath)) {
        node.setAttribute(attrName, resourceFullPath.replace(pagesDirectoryPath, ''))
      }
    }
  }
}

module.exports.traverseNode = traverseNode;
