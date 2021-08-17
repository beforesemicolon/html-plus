const path = require('path');
const {PartialFile} = require("../PartialFile");
const chalk = require("chalk");
const {html} = require("../html");

class Include {
  constructor(node, options) {
    this.data = node.getAttribute('data');
    
    if (this.data && this.data.toString() !== '[object Object]') {
      throw new Error('The "<include>" tag "data" attribute value must be a normal object literal')
    }
    
    const {file, partialFiles} = options;
    
    this.node = node;
    this.partial = null;
    let partialName = node.getAttribute('partial');
    let partialPath = node.getAttribute('partial-path');
    
    if (partialName || partialPath) {
      if (partialFiles.length ) {
        if (partialPath) {
          partialPath = path.resolve(file.fileDirectoryPath, partialPath);
        } else {
          partialName = '_' + partialName.replace(/^_+/, '');
        }

        this.partial = partialFiles.find(obj => {
          return obj.name === partialName || obj.fileAbsolutePath === partialPath;
        });
      }

      if (!this.partial && partialPath) {
        const partialAbsolutePath = path.resolve(file.fileDirectoryPath, partialPath);

        this.partial = new PartialFile(partialAbsolutePath, file.srcDirectoryPath);
      }
  
      if (!this.partial) {
        const cloneNode = node.cloneNode();
        cloneNode.textContent = '...';
        
        console.warn(chalk.yellowBright(
          `[HTML+] Partial "${partialName || partialPath}" not found.\n${chalk.greenBright(cloneNode.outerHTML)}`
        ));
      }
    }
  }
  
  static customAttributes = {
    data: {execute: true}
  }
  
  render() {
    return this.partial
      ? this.partial.render({...this.node.context, ...this.data})
      : '';
  }
}

module.exports.Include = Include;
