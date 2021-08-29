const {writeFile, unlink, mkdir, rmdir, rm, copyFile, readFile} = require('fs');
const {promisify} = require('util');

module.exports = {
  writeFile: promisify(writeFile),
  readFile: promisify(readFile),
  unlink: promisify(unlink),
  mkdir: promisify(mkdir),
  rmdir: promisify(rmdir),
  rm: promisify(rm),
  copyFile: promisify(copyFile),
}
