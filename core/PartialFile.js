const path = require('path');
const {parse} = require('node-html-parser');
const {required} = require("./utils/required");
const {replaceSpecialCharactersInHTML} = require("./parser/utils/replace-special-characters-in-HTML");
const {HTMLNode} = require("./parser/HTMLNode");
const {File} = require("./File");

class PartialFile extends File {
  constructor(fileAbsolutePath = required('fileAbsolutePath'), srcDirectoryPath = '', options = {}) {
    const fileName = path.basename(fileAbsolutePath);
  
    if (!fileName.startsWith('_')) {
      throw new Error('Cannot create partial file. Partial files must start with underscore(_).');
    }
  
    if (!fileName.endsWith('.html')) {
      throw new Error('Cannot create partial file. Partial files must be an HTML file.');
    }
    
    super(fileAbsolutePath, srcDirectoryPath);
    
    this.options = options;
    
    this.load();
  }
  
  render(contextData = {}) {
    const parsedHTML = parse(replaceSpecialCharactersInHTML(this.content), {
      comment: true
    });
    parsedHTML.context = contextData;
    const partialNode = new HTMLNode(parsedHTML, this.options);
    return partialNode.render()
  }
  
  toString() {
    return this.render();
  }
}

module.exports.PartialFile = PartialFile;