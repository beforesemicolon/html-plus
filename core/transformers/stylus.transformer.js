const stylus = require('stylus');

const defaultOptions = {
  env: 'development',
  file: null,
  functions: {},
  set: {},
  define: {},
  includes: [],
  imports: [],
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
    const {set, define, includes, imports, ...options} = opt;
    
    const styl = stylus(content, {
      ...options,
      filename: opt.file?.fileAbsolutePath,
      ...(opt.env === 'production' && {sourceMap: 'inline'}),
    });
  
    for (let x in set) {
      if (set.hasOwnProperty(x)) {
        styl.set(x, opt.set[x])
      }
    }
  
    for (let x in define) {
      if (define.hasOwnProperty(x)) {
        styl.define(x, define[x])
      }
    }
    
    includes.forEach(inc => {
      styl.include(inc)
    })
  
    imports.forEach(imp => {
      styl.import(imp)
    })
  
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