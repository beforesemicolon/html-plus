const stylus = require('stylus');
const {promisify} = require('util');

const render = promisify(stylus.render);

const defaultOptions = {
  env: 'development',
  file: null,
}

async function stylusTransformer(content = null, opt = defaultOptions) {
  opt = {...defaultOptions, ...opt};
  content = content ?? '';
  
  return await render(content, {
    filename: opt.file?.fileAbsolutePath,
    // ...(opt.env === 'development' && {sourceMap: 'inline'}),
  })
    .then(css => {
      return css;
    });
}

module.exports.stylusTransformer = stylusTransformer;
module.exports.defaultOptions = defaultOptions;