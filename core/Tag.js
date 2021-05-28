const {createPartialFile} = require("./utils/create-partial-file");
const {renderChildren} = require("./utils/render-children");
const {createTagName} = require("./utils/create-tag-name");
const {defineGetter} = require("./utils/define-getter");
const {composeTagString} = require("./utils/compose-tag-string");

class Tag {
  constructor(tagInfo) {
    const {attributes, children} = tagInfo;
    const tagName = createTagName(this.constructor.name);
    
    defineGetter(this, 'attributes', () => attributes);
    defineGetter(this, 'children', () => children);
    defineGetter(this, 'tagName', () => tagName);
    
    this.createPartialFile = (partialAbsPath, srcDirectoryPath) => {
      return createPartialFile(partialAbsPath, srcDirectoryPath, tagInfo);
    }
  }
  
  get context() {
    return {};
  }
  
  render() {
    return '';
  }
  
  async renderChildren(children = this.children) {
    return await renderChildren(children);
  }
  
  composeTagString(content = '') {
    return composeTagString(this, content);
  }
}

module.exports.Tag = Tag;