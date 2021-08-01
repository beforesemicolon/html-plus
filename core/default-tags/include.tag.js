const path = require('path');
const {PartialFile} = require("../PartialFile");
const {composeTagString} = require("../parser/compose-tag-string");
const chalk = require("chalk");

class Include {
  constructor(node, options) {
    const {file, partialFiles} = options;
    
    this.node = node;
    this.partial = null;
    let partialName = node.attributes['partial'];
    let partialPath = node.attributes['partial-path'];
    this.data = {...node.context, ...node.attributes['data']};
    
    if (this.data && typeof this.data !== 'object') {
      throw new Error('The "<include>" tag "data" attribute value must be a normal object literal')
    }
    
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

        this.partial = new PartialFile(partialAbsolutePath, file.srcDirectoryPath, tagInfo);
      }
  
      if (!this.partial) {
        console.warn(chalk.yellowBright(
          `[HTML+] Partial "${partialName || partialPath}" not found.\n${chalk.greenBright(composeTagString(node, '...'))}`
        ));
      }
    }
  }
  
  static customAttributes = {
    data: {execute: true}
  }
  
  render() {
    return this.partial
      ? this.partial.render(this.data)
      : '';
  }
}

module.exports.Include = Include;
