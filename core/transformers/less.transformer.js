const less = require('less');
const {promisify} = require('util');

const render = promisify(less.render);

const defaultOptions = {
  env: 'development',
  assetsPath: './',
  plugins: [],
  file: null
}

async function lessTransformer(content, opt = defaultOptions) {
  if (content && typeof content === 'object') {
    opt = content;
    content = null;
  
    if (!opt.file) {
      throw new Error('If no string content is provided, the "file" option must be provided.')
    }
  }
  
  opt = {...defaultOptions, ...opt};
  content = content ?? '';
  
  const options = {
    ...defaultOptions,
    env: opt.env,
    filename: opt.file?.fileAbsolutePath,
    // ...(opt.env === 'development' && {sourceMap: {}})
  }
  
  return render(content, options).then(res => {
    return res.css;
  });
}

module.exports.lessTransformer = lessTransformer;
module.exports.defaultOptions = defaultOptions;