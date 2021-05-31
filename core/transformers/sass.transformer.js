const {promisify} = require('util');
const nodeSass = require('node-sass');

const render = promisify(nodeSass.render);

const defaultOptions = {
  env: 'development',
  fileObject: null,
  outputStyle: 'nested',
  includePaths: []
}

async function sassTransformer(content, opt = defaultOptions) {
  if (!content || typeof content !== 'string') return '';
  
  opt = {...defaultOptions, ...opt};
  
  if (opt.env === 'production') {
    opt.outputStyle = 'compressed';
  }
  
  return render({
    data: content,
    file: opt?.fileObject?.fileAbsolutePath,
    indentedSyntax: opt?.fileObject?.ext === '.sass',
    // ...(opt.env === 'development' && {sourceMap: true}),
    ...opt
  }).then(res => res.css.toString())
}

module.exports.sassTransformer = sassTransformer;
module.exports.defaultOptions = defaultOptions;