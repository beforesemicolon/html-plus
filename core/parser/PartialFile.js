const path = require('path');
const {required} = require("../utils/required");
const {File} = require("./File");
const {RenderNode} = require("./RenderNode");

class PartialFile extends File {
  constructor(fileAbsolutePath = required('fileAbsolutePath'), srcDirectoryPath = '') {
    const fileName = path.basename(fileAbsolutePath);
  
    if (!fileName.startsWith('_')) {
      throw new Error('Cannot create partial file. Partial files must start with underscore(_).');
    }
  
    if (!fileName.endsWith('.html')) {
      throw new Error('Cannot create partial file. Partial files must be an HTML file.');
    }
    
    super(fileAbsolutePath, srcDirectoryPath);
    this.load();
  }
  
  render(data = {}) {
    return new RenderNode(this.content, data, this);
  }
}

module.exports.PartialFile = PartialFile;
