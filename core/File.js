const path = require('path');
const {required} = require("./utils/required");
const {readFileContent} = require("./utils/readFileContent");

class File {
  resources = [];
  #content = '';
  #loaded = false;
  #srcDirectoryPath = '';
  #ext = '';
  #file = '';
  #name = '';
  #filePath = '';
  #fileAbsolutePath = '';
  #fileDirectoryPath = '';
  
  constructor(itemPath = required('itemPath'), src = '') {
    const file = path.basename(itemPath);
    const ext = path.extname(file);
    
    src = src || (itemPath.replace(file, ''));
    itemPath = path.resolve(src, itemPath);
    
    this.#srcDirectoryPath = src;
    this.#ext = ext;
    this.#file = file;
    this.#name = file.replace(ext, '');
    this.#filePath = itemPath.replace(src, '');
    this.#fileAbsolutePath = itemPath;
    this.#fileDirectoryPath = itemPath.replace(file, '');
  }
  
  get srcDirectoryPath() {
    return this.#srcDirectoryPath;
  }
  
  get ext() {
    return this.#ext;
  }
  
  get file() {
    return this.#file;
  }
  
  get name() {
    return this.#name;
  }
  
  get filePath() {
    return this.#filePath;
  }
  
  get fileAbsolutePath() {
    return this.#fileAbsolutePath;
  }
  
  get fileDirectoryPath() {
    return this.#fileDirectoryPath;
  }
  
  get content() {
    return this.#content;
  }
  
  set content(value) {
    if (typeof value === "string" || value instanceof Buffer) {
      this.#loaded = true;
      this.#content = value.toString();
      return;
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
  
  toBuffer() {
    return Buffer.from(this.toString(), "utf-8")
  }
}

module.exports.File = File;
