const path = require('path');
const {parse} = require('node-html-parser');
const {required} = require("./utils/required");
const {replaceSpecialCharactersInHTML} = require("./utils/replace-special-characters-in-HTML");
const {HTMLNode} = require("./HTMLNode");
const {File} = require("./File");

class PartialFile extends File {
  #options = {};
  
  constructor(fileAbsolutePath = required('fileAbsolutePath'), srcDirectoryPath = '', options = {}) {
    const fileName = path.basename(fileAbsolutePath);
  
    if (!fileName.startsWith('_')) {
      throw new Error('Cannot create partial file. Partial files must start with underscore(_).');
    }
  
    if (!fileName.endsWith('.html')) {
      throw new Error('Cannot create partial file. Partial files must be an HTML file.');
    }
    
    super(fileAbsolutePath, srcDirectoryPath);
    
    this.#options = {context: {}, children: [], ...options};
    
    this.load();
  }
  
  async render(contextData = {}) {
    const {context, children} = this.#options;
    const parsedHTML = parse(replaceSpecialCharactersInHTML(this.content));
    parsedHTML.context = {...context, ...contextData};
    const partialNode = new HTMLNode(parsedHTML, {...this.#options, rootChildren: children});
    return (await partialNode.render()).trim()
  }
}

module.exports.PartialFile = PartialFile;