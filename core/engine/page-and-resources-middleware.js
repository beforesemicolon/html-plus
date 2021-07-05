const path = require("path");
const {readFileContent} = require("../utils/readFileContent");
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
])

function pageAndResourcesMiddleware(pagesRoutes, pagesDirectoryPath, {env, onPageRequest}) {
  return async (req, res, next) => {
    const ext = path.extname(req.path);
    
    if (ext && sourcesExtensions.has(ext)) {
      let content = '';
      let resourcePath = '';
  
      if (/node_modules/.test(req.path)) {
        resourcePath = path.join(process.cwd(), req.path);
  
        try {
          content = readFileContent(resourcePath);
          
          if (ext === '.css') {
            res.setHeader('Content-Type', 'text/css');
          } else if(ext === '.js' || ext === '.mjs') {
            res.setHeader('Content-Type', 'application/javascript');
          }
          
          return res.send(content);
        } catch(e) {
          console.error(`Failed to load page resource "${req.path}"`, e);
          return res.sendStatus(404);
        }
      }
  
      resourcePath = path.join(pagesDirectoryPath, req.path);
  
      try {
        const file = new File(resourcePath, pagesDirectoryPath);
        
        switch (ext) {
          case '.scss':
          case '.sass':
            content = await transformResource.sass({file});
            content = (await transformResource.css(content, {file})).content;
            res.setHeader('Content-Type', 'text/css');
            break;
          case '.less':
            content = await transformResource.less({file});
            content = (await transformResource.css(content, {file})).content;
            res.setHeader('Content-Type', 'text/css');
            break;
          case '.styl':
            content = await transformResource.stylus({file});
            content = (await transformResource.css(content, {file})).content;
            res.setHeader('Content-Type', 'text/css');
            break;
          case '.css':
            content = (await transformResource.css(content, {file})).content;
            res.setHeader('Content-Type', 'text/css');
            break;
          case '.js':
          case '.jsx':
          case '.ts':
          case '.tsx':
          case '.mjs':
          case '.cjs':
            const result = await transformResource.js({file});
            content = result.content;
            res.setHeader('Content-Type', 'application/javascript');
            break;
        }
        
        return res.send(content);
      } catch(e) {
        console.error(`Failed to load page resource "${req.path}"`, e);
        return res.sendStatus(404);
      }
    } else if(!ext || ext === '.html') {
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