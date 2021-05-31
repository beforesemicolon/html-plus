const path = require('path');
const {required} = require("./utils/required");
const {readFileContent} = require("./utils/readFileContent");
const {defineGetter} = require("./utils/define-getter");

class File {
  resources = [];
  resourceBase = '';
  #content = '';
  #loaded = false;
  
  constructor(itemPath = required('itemPath'), src = '') {
    const file = path.basename(itemPath);
    const ext = path.extname(file);
    
    src = src || (itemPath.replace(file, ''));
    itemPath = path.resolve(src, itemPath);
    
    defineGetter(this, 'srcDirectoryPath', src);
    defineGetter(this, 'ext', ext);
    defineGetter(this, 'file', file);
    defineGetter(this, 'name', file.replace(ext, ''));
    defineGetter(this, 'filePath', itemPath.replace(src, ''));
    defineGetter(this, 'fileAbsolutePath', itemPath);
    defineGetter(this, 'fileDirectoryPath', itemPath.replace(file, ''));
  }
  
  get content() {
    return this.#content;
  }
  
  set content(value) {
    if (typeof value === "string" || value instanceof Buffer) {
      this.#loaded = true;
      return this.#content = value;
    }
    
    throw new Error('File content can only be a string or a Buffer type')
  }
  
  load() {
    this.#loaded = true;
    this.#content = readFileContent(this.fileAbsolutePath);
  }
  
  toString() {
    if (!this.#loaded) {
      this.load();
    }
    
    return this.#content.toString()
  }
}

module.exports.File = File;