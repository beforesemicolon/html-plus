const path = require('path');

class FileObject {
  constructor(itemPath, src = './') {
    this.srcDirectoryPath = src;
    this.ext = path.extname(itemPath);
    this.file = path.basename(itemPath);
    this.name = this.file.replace(this.ext, '');
    this.filePath = itemPath.replace(src, '');
    this.fileAbsolutePath = path.resolve(src, itemPath);
    this.fileDirectoryPath = this.fileAbsolutePath.replace(this.file, '');
    this.resources = [];
    this.resourceBase = '';
    this.content = '';
  }
}

module.exports.FileObject = FileObject;