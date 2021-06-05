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
  '.ts',
  '.tsx',
  '.jsx',
])

function pageAndResourcesMiddleware(pagesRoutes, pagesDirectoryPath, {env, onPageRequest}) {
  return async (req, res, next) => {
    const ext = path.extname(req.path);
    
    if (ext && sourcesExtensions.has(ext)) {
      const resourcePath = path.join(pagesDirectoryPath, req.path);
      let content = ''
      
      try {
        const fileObject = new File(resourcePath);
        switch (ext) {
          case '.scss':
          case '.sass':
            content = await transformResource.sass(null, {fileObject, env});
            res.setHeader('Content-Type', 'text/css');
            break;
          case '.less':
            content = await transformResource.less(null, {fileObject, env});
            res.setHeader('Content-Type', 'text/css');
            break;
          case '.styl':
            content = await transformResource.stylus(null, {fileObject, env});
            res.setHeader('Content-Type', 'text/css');
            break;
          case '.css':
            content = await transformResource.css(null, {fileObject, env});
            res.setHeader('Content-Type', 'text/css');
            break;
          case '.js':
          case '.jsx':
          case '.ts':
          case '.tsx':
            content = await transformResource.js(null, {fileObject, env});
            res.setHeader('Content-Type', 'application/javascript');
            break;
        }
        
        return res.send(content);
      } catch(e) {
        console.error(`Failed to load page resource "${req.path}"`, e);
        return res.sendStatus(404);
      }
    } else {
      const template = pagesRoutes[req.path] ?? pagesRoutes[`${req.path}/`] ?? pagesRoutes['/404'];
      
      if (template) {
        return res.render(template, onPageRequest(req) ?? {})
      } else if(!ext || ext === '.html') {
        return res.send('<h1>404 - Page Not Found</h1>')
      }
    }
    
    next()
  }
}

module.exports.pageAndResourcesMiddleware = pageAndResourcesMiddleware;