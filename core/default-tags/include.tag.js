const path = require('path');
const {PartialFile} = require("../PartialFile");
const {Tag} = require('../Tag');

class Include extends Tag {
  constructor(tagInfo) {
    super(tagInfo);
    
    const {fileObject, partialFiles} = tagInfo;
  
    this.partial = null;
    let partialName = this.attributes['partial'];
    let partialPath = this.attributes['partialPath'];
    this.data = this.attributes['data'];
    
    if (this.data && typeof this.data !== 'object') {
      throw new Error('The "<include>" tag "data" attribute value must be a normal object literal')
    }
    
    if (partialName || partialPath) {
      if (partialFiles.length ) {
        if (partialPath) {
          partialPath = path.resolve(fileObject.fileDirectoryPath, partialPath);
        } else {
          partialName = '_' + partialName.replace(/^_+/, '');
        }
    
        this.partial = partialFiles.find(obj => {
          return obj.name === partialName || obj.fileAbsolutePath === partialPath;
        });
      }
  
      if (!this.partial && partialPath) {
        const partialAbsolutePath = path.resolve(fileObject.fileDirectoryPath, partialPath);
  
        this.partial = new PartialFile(partialAbsolutePath, fileObject.srcDirectoryPath, tagInfo);
      }
    }
  }
  
  static customAttributes = {
    data: {bind: true},
    partial: {bind: false},
    'partial-path': {bind: false},
  }
  
  async render() {
    return this.partial
      ? await this.partial.render(this.data)
      : '';
  }
}

module.exports.Include = Include;