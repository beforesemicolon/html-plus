const {sassTransformer} = require('./sass.transformer');
const {stylusTransformer} = require('./stylus.transformer');
const {cssTransformer} = require('./css.transformer');
const {lessTransformer} = require('./less.transformer');
const {jsTransformer} = require('./js.transformer');

const transform = {
  sass: sassTransformer,
  less: lessTransformer,
  stylus: stylusTransformer,
  css: cssTransformer,
  js: jsTransformer
};

const sourcesExtensions = new Set([
  '.scss',
  '.sass',
  '.css',
  '.less',
  '.styl',
  '.js',
  '.mjs',
  '.cjs',
  '.ts',
  '.tsx',
  '.jsx',
]);

/**
 * transforms file based on their extension using the provided options
 * as long as they are supported file extension
 * @param file
 * @param opt
 * @returns {Promise<string|*>}
 */
const transformFile = async (file, opt = {}) => {
  if (sourcesExtensions.has(file.ext)) {
    let content = '';
    
    switch (file.ext) {
      case '.scss':
      case '.sass':
        content = await transform.sass({file, ...opt});
        return (await transform.css(content, {file, ...opt})).content;
      case '.less':
        content = await transform.less({file, ...opt});
        return (await transform.css(content, {file, ...opt})).content;
      case '.styl':
        content = await transform.stylus({file, ...opt});
        return (await transform.css(content, {file, ...opt})).content;
      case '.css':
        return (await transform.css({file, ...opt})).content;
      case '.js':
      case '.jsx':
      case '.ts':
      case '.tsx':
      case '.mjs':
      case '.cjs':
        const result = await transform.js({file, ...opt});
        return result.content;
      default:
        return content;
    }
  }
}

module.exports.transform = transform;
module.exports.transformFile = transformFile;
module.exports.sourcesExtensions = sourcesExtensions;
