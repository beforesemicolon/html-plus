const {promisify} = require('util');
const nodeSass = require('node-sass');

const render = promisify(nodeSass.render);

const defaultOptions = {
  env: 'development',
  file: null,
}

async function sassTransformer(content, opt = defaultOptions) {
  if (content && typeof content === 'object') {
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