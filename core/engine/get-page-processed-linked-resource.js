const {cacheService} = require("../CacheService");
const {File} = require("../parser/File");
const {transform} = require('../transformers');

async function getPageProcessedLinkedResource(resourcePath, pagesDirectoryPath, options) {
  // for production, using the cached transformed pages help the CSS purge
  // better decide which CSS to keep or remove
  const destPath = options.env === 'production'
    ? cacheService.cacheDir : pagesDirectoryPath;
  const {postCSS, less, sass, stylus, env} = options
  const file = new File(resourcePath, pagesDirectoryPath);
  const opts = {
    '.scss': ['sass', sass],
    '.sass': ['sass', sass],
    '.less': ['less', less],
    '.styl': ['stylus', stylus],
    '.css': []
  }
  let contentType = 'text/css';
  let content = '';
  
  if (cacheService.hasCachedValue(resourcePath)) {
    content = cacheService.getCachedValue(resourcePath);
  } else {
    const [service, opt] = opts[file.ext] || ['js', {env}];
  
    if (service) {
      const res = await transform[service]({file, ...opt});
      content = res.content || res;
    
      if (options.env === 'production') {
        cacheService.cache(resourcePath, content);
      }
    }
  }
  
  switch (file.ext) {
    case '.scss':
    case '.sass':
    case '.less':
    case '.styl':
      content = (await transform.css(content, {file, destPath, env, ...postCSS})).content;
      break;
    case '.css':
      content = (await transform.css({file, destPath, env, ...postCSS})).content;
      break;
    default: // it is js by default
      contentType = 'application/javascript';
      break;
  }
  
  return {content, contentType};
}

module.exports.getPageProcessedLinkedResource = getPageProcessedLinkedResource;
