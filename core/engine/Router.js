const express = require("express");
const path = require("path");
const {getPageProcessedLinkedResource} = require("./get-page-processed-linked-resource");
const {defaultOptions} = require("./default-options");
const {resourceExtensions} = require('./resource-extensions');

class Router {
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
      if (this.options.tagStyles[req.path]) {
        res.setHeader('Content-Type', 'text/css');
        return res.send(this.options.tagStyles[req.path].join('\n').replace(/\s+/gm, ' '));
      }
      
      const ext = path.extname(req.path);
      
      if (ext && resourceExtensions.has(ext)) {
        let resourcePath;
        
        if (/node_modules/.test(req.path)) {
          resourcePath = path.join(process.cwd(), req.path);
        } else {
          resourcePath = path.join(this.pagesDirectoryPath, req.path);
        }
        
        try {
          const {content, contentType} = await getPageProcessedLinkedResource(resourcePath, this.pagesDirectoryPath, this.options)
          
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
