const path = require("path");
const {transform: transformResource} = require('../transformers');
const {File} = require('../File');

const sourcesExtensions = new Set([
  '.scss',
  '.sass',
  '.css',
  '.less',
  '.styl',
  '.js',
  '.mjs',
  '.cjs',
  '.ts',
  '.tsx',
  '.jsx',
]);
const cache = {};

function pageAndResourcesMiddleware(pagesRoutes, pagesDirectoryPath, {env, onPageRequest}) {
  return async (req, res, next) => {
    if (req.method === 'GET') {
      const ext = path.extname(req.path);
  
      if (ext && sourcesExtensions.has(ext)) {
        let content = '';
        let contentType = 'text/css';
        let resourcePath = '';
        let file = null;
    
        if (/node_modules/.test(req.path)) {
          resourcePath = path.join(process.cwd(), req.path);
        } else {
          resourcePath = path.join(pagesDirectoryPath, req.path);
        }
    
        if (env === 'production' && cache[resourcePath]) {
          res.setHeader('Content-Type', cache[resourcePath].contentType);
          return res.send(cache[resourcePath].content);
        }
    
        file = new File(resourcePath, pagesDirectoryPath);
    
        try {
          switch (ext) {
            case '.scss':
            case '.sass':
              content = await transformResource.sass({file});
              content = (await transformResource.css(content, {file, env})).content;
              break;
            case '.less':
              content = await transformResource.less({file});
              content = (await transformResource.css(content, {file, env})).content;
              break;
            case '.styl':
              content = await transformResource.stylus({file});
              content = (await transformResource.css(content, {file, env})).content;
              break;
            case '.css':
              content = (await transformResource.css({file, env})).content;
              break;
            case '.js':
            case '.jsx':
            case '.ts':
            case '.tsx':
            case '.mjs':
            case '.cjs':
              const result = await transformResource.js({file, env});
              content = result.content;
              contentType = 'application/javascript';
              break;
          }
      
          if (env === 'production') {
            cache[resourcePath] = {content, contentType}
          }
      
          res.setHeader('Content-Type', contentType);
      
          return res.send(content);
        } catch(e) {
          console.error(`Failed to load style/script content "${req.path}"`, e);
          return res.sendStatus(404);
        }
      } else if(!ext || ext === '.html') {
        const template = pagesRoutes[req.path] ?? pagesRoutes[`${req.path}/`];
    
        if (template) {
          return res.render(template, onPageRequest(req) || {})
        } else if(!ext || ext === '.html') {
      
          if (req.path.startsWith('/404')) {
            return pagesRoutes['/404']
              ? res.render(pagesRoutes['/404'])
              : res.send('<h1>404 - Page Not Found</h1>')
          }
      
          return res.redirect('/404')
        }
      }
    }
    
    next()
  }
}

module.exports.pageAndResourcesMiddleware = pageAndResourcesMiddleware;