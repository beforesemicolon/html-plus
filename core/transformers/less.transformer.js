const less = require('less');
const {promisify} = require('util');

const render = promisify(less.render);

const defaultOptions = {
  env: 'development',
  assetsPath: './',
  plugins: [],
  fileObject: null
}

async function lessTransformer(content, opt = defaultOptions) {
  if (!content || typeof content !== 'string') return '';
  
  opt = {...defaultOptions, ...opt};
  
  const options = {
    ...defaultOptions,
    env: opt.env,
    filename: opt?.fileObject?.fileAbsolutePath,
    // ...(opt.env === 'development' && {sourceMap: {}})
  }
  
  return render(content, options).then(res => {
    return res.css;
  });
}

module.exports.lessTransformer = lessTransformer;
module.exports.defaultOptions = defaultOptions;