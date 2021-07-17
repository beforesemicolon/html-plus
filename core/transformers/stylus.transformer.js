const stylus = require('stylus');

const defaultOptions = {
  env: 'development',
  file: null,
  paths: []
}

async function stylusTransformer(content = null, opt = defaultOptions) {
  if (content && typeof content === 'object') {
    opt = content;
    content = null;
    
    if (!opt.file) {
      throw new Error('If no string content is provided, the "file" option must be provided.')
    }
  }
  
  opt = {...defaultOptions, ...opt};
  content = content ?? '';
  
  return await (new Promise((res, rej) => {
    
    const styl = stylus(content, {
      ...opt,
      filename: opt.file?.fileAbsolutePath,
      ...(opt.env === 'production' && {sourceMap: 'inline'}),
    });

  
    styl.render((err, css) => {
        if (err) {
          return rej(err);
        }
        
        res(css)
      })
  }))
}

module.exports.stylusTransformer = stylusTransformer;
module.exports.defaultOptions = defaultOptions;