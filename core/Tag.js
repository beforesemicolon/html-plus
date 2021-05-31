const {PartialFile} = require("./PartialFile");
const {renderChildren} = require("./utils/render-children");
const {turnCamelOrPascalToKebabCasing} = require("./utils/turn-camel-or-pascal-to-kebab-casing");
const {defineGetter} = require("./utils/define-getter");
const {composeTagString} = require("./utils/compose-tag-string");

const defaultOptions = {
  env: 'development',
  data: {},
  customTags: {},
  customAttributes: {},
  fileObject: null,
  rootChildren: null,
  onTraverse() {},
  partialFileObjects: [],
  attributes: {},
  children: [],
  context: {},
  root: null,
  innerHTML: '',
  partialFiles: []
}

class Tag {
  constructor(tagInfo = defaultOptions) {
    const {attributes = {}, children = []} = {...defaultOptions, ...tagInfo};
    const tagName = turnCamelOrPascalToKebabCasing(this.constructor.name);
    
    defineGetter(this, 'attributes', () => attributes);
    defineGetter(this, 'children', () => children);
    defineGetter(this, 'tagName', () => tagName);
    
    this.createPartialFile = (partialAbsPath, srcDirectoryPath) => {
      return new PartialFile(partialAbsPath, srcDirectoryPath, tagInfo);
    }
  }
  
  get context() {
    return {};
  }
  
  static customAttributes = {}
  
  render() {
    return '';
  }
  
  async renderChildren(children = this.children) {
    return await renderChildren(children);
  }
  
  composeTagString(content = '', exceptionAttributes = {}) {
    return composeTagString(this, content, exceptionAttributes);
  }
}

module.exports.Tag = Tag;