const fs = require('fs');
const path = require('path');
const express = require("express");
const {PartialFile} = require("../PartialFile");
const {pageAndResourcesMiddleware} = require("./page-and-resources-middleware");
const {transform} = require('../transform');
const {getDirectoryFilesDetail} = require('../utils/getDirectoryFilesDetail');
const {File} = require('../File');
const validUrl = require('valid-url');
const {isObject, isArray, isFunction} = require("util");
const {mergeObjects} = require("../utils/merge-objects");

const defaultOptions = {
  staticData: {},
  customTags: [],
  customAttributes: [],
  env: 'development',
  sass: {
    indentWidth: 2,
    precision: 5,
    indentType: 'space',
    linefeed: 'lf',
    sourceComments: false,
    includePaths: [],
    functions: {},
  },
  less: {
    strictUnits: false,
    insecure: false,
    paths: [],
    math: 1,
    urlArgs: '',
    modifyVars: null,
    lint: false,
  },
  stylus: {
    functions: {},
    set: {},
    define: {},
    includes: [],
    imports: [],
  },
  postCSS: {
    plugins: []
  },
  onPageRequest() {
  }
}

const engine = (app, pagesDirectoryPath, opt = {}) => {
  if (!app) {
    throw new Error('engine first argument must be provided and be a valid express app.')
  }
  
  let hbConfig = {};
  
  try {
    hbConfig = require(path.join(process.cwd(), 'hp.config.js'));
  } catch (e) {
    if (e.code !== 'MODULE_NOT_FOUND') {
      e.message = `hp.config.js file loading failed: ${e.message}`
      throw new Error(e)
    }
  }
  
  opt = {...defaultOptions, ...mergeObjects(hbConfig, opt)};
  
  if (!isObject(opt.staticData)) {
    throw new Error('HTML+ static data option must be a javascript object')
  }
  
  if (!isArray(opt.customTags)) {
    throw new Error('HTML+ custom tags option must be an array of valid tags.')
  }
  
  if (!isArray(opt.customAttributes)) {
    throw new Error('HTML+ custom attributes option must be an array of valid attributes.')
  }
  
  if (!isFunction(opt.onPageRequest)) {
    throw new Error('"onPageRequest" option must be a function')
  }
  
  if (!['development', 'production'].includes(opt.env)) {
    opt.env = 'development';
    console.warn('HTML+ swapped "ENV" to development because the value provided is not a supported one.')
  }
  
  const partials = [];
  const pagesRoutes = {};
  
  return getDirectoryFilesDetail(pagesDirectoryPath, filePath => {
    if (filePath.endsWith('.html')) {
      const fileName = path.basename(filePath);
      
      if (fileName.startsWith('_')) {
        partials.push(new PartialFile(filePath, pagesDirectoryPath));
      } else {
        filePath = filePath.replace(pagesDirectoryPath, '');
        const template = `${filePath.replace('.html', '')}`.slice(1);
        let tempPath = '';
        
        if (filePath.endsWith('index.html')) {
          tempPath = filePath.replace('/index.html', '');
          pagesRoutes[tempPath || '/'] = template;
          pagesRoutes[`${tempPath}/`] = template;
          pagesRoutes[`${tempPath}/index.html`] = template;
        } else {
          tempPath = filePath.replace('.html', '');
          pagesRoutes[tempPath] = template;
          pagesRoutes[`${tempPath}/`] = template;
        }
      }
    }
    
    return false;
  })
    .then(() => {
      app.engine('html', (filePath, {settings, _locals, cache, ...context}, callback) => {
        const fileName = path.basename(filePath);
        
        if (fileName.startsWith('_')) {
          callback(new Error(`Cannot render partial(${fileName}) file as page. Partial files can only be included.`));
        }
        
        fs.readFile(filePath, (err, content) => {
          if (err) return callback(err);
          const file = new File(filePath, settings.views);
          file.content = content;
          try {
            const result = transform(file.content, {
              data: opt.staticData,
              context,
              file,
              customTags: opt.customTags,
              customAttributes: opt.customAttributes,
              partialFiles: partials,
              onBeforeRender: (node, nodeFile) => {
                let attrName = '';
                
                if (node.tagName === 'link') {
                  attrName = 'href';
                } else if (node.tagName === 'script') {
                  attrName = 'src';
                }
                
                const srcPath = node.attributes[attrName];
                
                if (srcPath && !validUrl.isUri(srcPath)) {
                  const resourceFullPath = path.resolve(nodeFile.fileDirectoryPath, srcPath);
                  
                  if (resourceFullPath.startsWith(pagesDirectoryPath)) {
                    node.setAttribute(attrName, resourceFullPath.replace(pagesDirectoryPath, ''))
                  }
                }
              }
            })
            
            callback(null, result);
          } catch (e) {
            console.error(e.message);
            const cleanMsg = e.message
              .replace(/\[\d+m/g, '')
              .replace(/(>|<)/g, m => m === '<' ? '&lt;' : '&gt;');
            callback(null, `<pre>${cleanMsg}</pre>`);
          }
        })
      });
      
      app.set('views', pagesDirectoryPath);
      app.set('view engine', 'html');
      
      app.use(pageAndResourcesMiddleware(
        pagesRoutes,
        pagesDirectoryPath,
        opt
      ));
      app.use(express.static(pagesDirectoryPath))
      
      console.log('HTML+ engine is ready');
    })
};

module.exports.engine = engine;
