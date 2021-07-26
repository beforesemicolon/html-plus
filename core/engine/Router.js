const express = require("express");
const path = require("path");
const {defaultOptions} = require("./default-options");
const {transform: transformResource} = require('../transformers');
const {File} = require('../File');
const {cacheService} = require('../CacheService');

class Router {
  sourcesExtensions = new Set([
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
  #onPageRequest;
  
  constructor(app, {pagesRoutes, pagesDirectoryPath, options}) {
    this.pagesRoutes = pagesRoutes;
    this.pagesDirectoryPath = pagesDirectoryPath;
    this.options = {...defaultOptions, ...options};
    this.#onPageRequest = this.options.onPageRequest || (() => {
    });
    
    app.use(this.#resourceMiddleware.bind(this));
    app.use(express.static(this.pagesDirectoryPath))
  }
  
  async #resourceMiddleware(req, res, next) {
    if (req.method === 'GET') {
      const ext = path.extname(req.path);
      
      if (ext && this.sourcesExtensions.has(ext)) {
        const {postCSS, less, sass, stylus, env} = this.options
        let content = '';
        let contentType = 'text/css';
        let resourcePath;
        let file = null;
        
        if (/node_modules/.test(req.path)) {
          resourcePath = path.join(process.cwd(), req.path);
        } else {
          resourcePath = path.join(this.pagesDirectoryPath, req.path);
        }
        
        if (env === 'production' && cacheService.hasCachedValue(resourcePath)) {
          const cachedResource = cacheService.getCachedValue(resourcePath)
          res.setHeader('Content-Type', cachedResource.contentType);
          return res.send(cachedResource.content);
        }
        
        file = new File(resourcePath, this.pagesDirectoryPath);
        // for production, using the cached transformed pages help the CSS purge
        // better decide which CSS to keep or remove
        const destPath = env === 'production'
          ? cacheService.cacheDir
          : this.pagesDirectoryPath;
        
        try {
          switch (ext) {
            case '.scss':
            case '.sass':
              content = await transformResource.sass({file, ...sass});
              content = (await transformResource.css(content, {file, destPath, env, ...postCSS})).content;
              break;
            case '.less':
              content = await transformResource.less({file, ...less});
              content = (await transformResource.css(content, {file, destPath, env, ...postCSS})).content;
              break;
            case '.styl':
              content = await transformResource.stylus({file, ...stylus});
              content = (await transformResource.css(content, {file, destPath, env, ...postCSS})).content;
              break;
            case '.css':
              content = (await transformResource.css({file, destPath, env, ...postCSS})).content;
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
            cacheService.cache(resourcePath, {content, contentType})
          }
          
          res.setHeader('Content-Type', contentType);
          
          return res.send(content);
        } catch (e) {
          console.error(`Failed to load style/script content "${req.path}"`, e);
          return res.sendStatus(404);
        }
      } else if (!ext || ext === '.html') {
        const template = this.pagesRoutes[req.path] ?? this.pagesRoutes[`${req.path}/`];
        const contextData = this.#onPageRequest(req) || {};
        
        if (template) {
          return res.render(template, contextData, (err, html) => this.#handleTemplateError(err, html, res))
        } else if (!ext || ext === '.html') {
          if (req.path.startsWith('/404')) {
            return this.pagesRoutes['/404']
              ? res.render(this.pagesRoutes['/404'], contextData, (err, html) => this.#handleTemplateError(err, html, res))
              : res.send('<h1>404 - Page Not Found</h1>')
          }
          
          return res.redirect('/404')
        }
      }
    }
    
    next()
  }
  
  #handleTemplateError(err, html, res) {
    if (err) {
      // only redirect to the /error page if in production
      // in development mode the error can be displayed directly on the page
      if (this.options.env === 'production') {
        // make sure there is a error template page and that the error did not happen
        // inside the error template itself
        return !err.message.includes('/error.html') && this.pagesRoutes['/error']
          ? res.redirect(`/error`)
          : res.send('<h2>500 - Internal Server Error</h2>');
      } else {
        return res.send(err.message);
      }
    }
    
    res.send(html)
  }
  
  onPageRequest(callback) {
    this.#onPageRequest = callback;
  }
  
}

module.exports.Router = Router;
