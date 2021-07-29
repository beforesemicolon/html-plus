const {cacheService} = require("../CacheService");
const {File} = require("../File");
const {transform} = require('../transformers');

async function getPageProcessedLinkedResource(resourcePath, pagesDirectoryPath, options) {
  if (options.env === 'production' && cacheService.hasCachedValue(resourcePath)) {
    return cacheService.getCachedValue(resourcePath);
  }
  
  const {postCSS, less, sass, stylus, env} = options
  let contentType = 'text/css';
  let content = '';
  const file = new File(resourcePath, pagesDirectoryPath);
  // for production, using the cached transformed pages help the CSS purge
  // better decide which CSS to keep or remove
  const destPath = env === 'production'
    ? cacheService.cacheDir
    : pagesDirectoryPath;
  
  switch (file.ext) {
    case '.scss':
    case '.sass':
      content = await transform.sass({file, ...sass});
      content = (await transform.css(content, {file, destPath, env, ...postCSS})).content;
      break;
    case '.less':
      content = await transform.less({file, ...less});
      content = (await transform.css(content, {file, destPath, env, ...postCSS})).content;
      break;
    case '.styl':
      content = await transform.stylus({file, ...stylus});
      content = (await transform.css(content, {file, destPath, env, ...postCSS})).content;
      break;
    case '.css':
      content = (await transform.css({file, destPath, env, ...postCSS})).content;
      break;
    case '.js':
    case '.jsx':
    case '.ts':
    case '.tsx':
    case '.mjs':
    case '.cjs':
      const result = await transform.js({file, env});
      content = result.content;
      contentType = 'application/javascript';
      break;
  }
  
  if (env === 'production') {
    cacheService.cache(resourcePath, {content, contentType})
  }
  
  return {content, contentType};
}

module.exports.getPageProcessedLinkedResource = getPageProcessedLinkedResource;
