const fs = require('fs');
const path = require('path');
const {replaceSpecialCharactersInHTML} = require("./replace-special-characters-in-HTML");
const {HTMLNode} = require("../HTMLNode");
const {FileObject} = require("../../../controllers/FileObject");
const {parse} = require('node-html-parser');

const createPartialFile = (partialAbsPath, srcDirectoryPath, opt) => {
  const fileName = path.basename(partialAbsPath);
  
  if (!fileName.startsWith('_')) {
    throw new Error('Partial files must start with underscore(_)');
  }
  
  if (!fileName.endsWith('.html')) {
    throw new Error('Partial files must be an HTML file');
  }
  
  let content = '';
  
  try {
    content = (fs.readFileSync(path.resolve(process.cwd(), partialAbsPath))).toString();
  } catch(e) {
    throw new Error(`Could not find partial file at "${partialAbsPath}"`);
  }
  
  const {context, children} = opt;
  const file = new FileObject(partialAbsPath, srcDirectoryPath);
  
  file.content = content;
  
  file.render = async (data = {}) => {
    const parsedHTML = parse(replaceSpecialCharactersInHTML(file.content));
    parsedHTML.context = {...context, ...data};
    const partialNode = new HTMLNode(parsedHTML, {...opt, rootChildren: children});
    return (await partialNode.render()).trim()
  }
  
  return file;
}

module.exports.createPartialFile = createPartialFile;