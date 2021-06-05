const path = require('path');
const {PartialFile} = require("../PartialFile");

class Include {
  constructor(node, options) {
    const {fileObject, partialFileObjects} = options;
  
    this.node = node;
    this.partial = null;
    let partialName = node.attributes['partial'];
    let partialPath = node.attributes['partial-path'];
    this.data = {...node.context, ...node.attributes['data']};
    
    if (this.data && typeof this.data !== 'object') {
      throw new Error('The "<include>" tag "data" attribute value must be a normal object literal')
    }
    
    if (partialName || partialPath) {
      if (partialFileObjects.length ) {
        if (partialPath) {
          partialPath = path.resolve(fileObject.fileDirectoryPath, partialPath);
        } else {
          partialName = '_' + partialName.replace(/^_+/, '');
        }

        this.partial = partialFileObjects.find(obj => {
          return obj.name === partialName || obj.fileAbsolutePath === partialPath;
        });
      }

      if (!this.partial && partialPath) {
        const partialAbsolutePath = path.resolve(fileObject.fileDirectoryPath, partialPath);

        this.partial = new PartialFile(partialAbsolutePath, fileObject.srcDirectoryPath, tagInfo);
      }
    }
  
    for (let key in node.attributes['data']) {
      if (node.attributes['data'].hasOwnProperty(key)) {
        node.setContext(key, node.attributes['data'][key])
      }
    }
  }
  
  static customAttributes = {
    data: {execute: true},
    partial: null,
    'partial-path': null
  }
  
  async render() {
    return this.partial
      ? await this.partial.render(this.data, this.node.childNodes)
      : '';
  }
}

module.exports.Include = Include;