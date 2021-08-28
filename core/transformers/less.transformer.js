const less = require('less');
const {promisify} = require('util');

const render = promisify(less.render);

const defaultOptions = {
  env: 'development',
  file: null,
  strictUnits: false,
  insecure: false,
  paths: [],
  math: 1,
  urlArgs: '',
  modifyVars: null,
  lint: false,
}

/**
 * compile less CSS into raw CSS
 * @param content
 * @param opt
 * @returns {Promise<string|*>}
 */
async function lessTransformer(content, opt = defaultOptions) {
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
  
  const options = {
    ...opt,
    filename: opt.file?.fileAbsolutePath,
    ...(opt.env === 'production' && {sourceMap: {}})
  }
  
  return render(content, options).then(res => {
    return res.css;
  });
}

module.exports.lessTransformer = lessTransformer;
module.exports.defaultOptions = defaultOptions;
