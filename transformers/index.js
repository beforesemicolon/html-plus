const {readFileContent} = require("../core/utils/readFileContent");
const {sassTransformer} = require('./sass.transformer');
const {stylusTransformer} = require('./stylus.transformer');
const {cssTransformer} = require('./css.transformer');
const {lessTransformer} = require('./less.transformer');
const {jsTransformer} = require('./js.transformer');

const transform = {
  sassCSS: sassTransformer,
  lessCSS: lessTransformer,
  stylusCSS: stylusTransformer,
  css: cssTransformer,
  js: jsTransformer
};

function transformers(extension = {}) {
  return {
    ...transform,
    ...extension
  };
}

async function transformFile(fileObject, options = {}) {
  let content = null;
  
  switch (fileObject.ext) {
    case '.html':
      content = options.content || readFileContent(fileObject.fileAbsolutePath);
      content = content && await transform.html(content, {fileObject, ...options});
      break;
    case '.sass':
    case '.scss':
      content = options.content || readFileContent(fileObject.fileAbsolutePath);
      content = content && await transform.sassCSS(content, {fileObject, ...options});
      break;
    case '.less':
      content = options.content || readFileContent(fileObject.fileAbsolutePath);
      content = content && await transform.lessCSS(content, {fileObject, ...options});
      break;
    case '.styl':
      content = options.content || readFileContent(fileObject.fileAbsolutePath);
      content = content && await transform.stylusCSS(content, {fileObject, ...options});
      break;
    case '.css':
      content = options.content || readFileContent(fileObject.fileAbsolutePath);
      content = content && await transform.css(content, {fileObject, ...options});
      break;
    case '.ts':
    case '.js':
    case '.jsx':
    case '.tsx':
    case '.mjs':
      content = await transform.js(options.content, {fileObject, ...options});
      break;
    default:
  }
  
  return content;
}

module.exports.transformFile = transformFile;
module.exports.transformers = transformers;