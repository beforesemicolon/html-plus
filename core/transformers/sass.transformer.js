const {promisify} = require('util');
const nodeSass = require('node-sass');

const render = promisify(nodeSass.render);

const defaultOptions = {
  env: 'development',
  file: null,
  indentWidth: 2,
  precision: 5,
  indentType: 'space',
  linefeed: 'lf',
  sourceComments: false,
  functions: {},
  includePaths: [],
}

/**
 * compiles sass CSS into raw CSS
 * @param content
 * @param opt
 * @returns {Promise<string|*>}
 */
async function sassTransformer(content, opt = defaultOptions) {
  if (content === undefined || content === null) {
    return '';
  }
  
  /**
   * content can be left out completely by providing an option
   * which contains a file to read the content from
   */
  if (typeof content === 'object') {
    opt = content;
    content = null;
    
    if (!opt.file) {
      throw new Error('If no string content is provided, the "file" option must be provided.')
    }
  }
  
  opt = {...defaultOptions, ...opt};
  content = content ?? '';
  
  if (opt.env === 'production') {
    opt.outputStyle = 'compressed';
  }
  
  return render({
    ...opt,
    data: content,
    file: opt.file?.fileAbsolutePath,
    indentedSyntax: opt?.file?.ext === '.sass',
    ...(opt.env === 'production' && {sourceMap: true}),
  }).then(res => res.css.toString())
}

module.exports.sassTransformer = sassTransformer;
module.exports.defaultOptions = defaultOptions;
