const fs = require('fs');
const path = require('path');
const {collectHPConfig} = require("../utils/collect-hp-config");
const chalk = require("chalk");
const {traverseSourceDirectoryAndCollect} = require("./traverse-source-directory-and-collect");
const {transform} = require('../transform');
const {getDirectoryFilesDetail} = require('../utils/getDirectoryFilesDetail');
const {File} = require('../File');
const {traverseNode} = require("./traverse-node");
const {Router} = require("./Router");
const {isObject, isArray, isFunction} = require("util");
const {defaultOptions} = require("./default-options");
const {cacheService} = require('../CacheService');
const {deepStrictEqual} = require('assert');

const engine = (app, pagesDirectoryPath, opt = {}) => {
  if (!app) {
    throw new Error('engine first argument must be provided and be a valid express app.')
  }
  
  opt = collectHPConfig(defaultOptions, opt);
  
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
  const isProduction = opt.env === 'production';
  
  return getDirectoryFilesDetail(
    pagesDirectoryPath,
    traverseSourceDirectoryAndCollect(pagesDirectoryPath, partials, pagesRoutes)
  )
    .then(() => {
      app.engine('html', (filePath, {settings, _locals, cache, ...context}, callback) => {
        const fileName = path.basename(filePath);
        
        if (fileName.startsWith('_')) {
          callback(new Error(`Cannot render partial(${fileName}) file as page. Partial files can only be included.`));
        }
        
        fs.readFile(filePath, async (err, content) => {
          if (err) return callback(err);
          
          // if context of the page does not change, return the cached page
          if (isProduction) {
            if (cacheService.hasCachedValue(filePath)) {
              const oldContext = cacheService.getCachedValue(filePath);
              
              try {
                deepStrictEqual(context, oldContext);
                return callback(null, await cacheService.getCachedFile(filePath));
              } catch (e) {
              }
            }
            
            cacheService.cache(filePath, context);
          }
          
          const file = new File(filePath, settings.views);
          file.content = content;
          
          try {
            let html = transform(file.content, {
              data: opt.staticData,
              context,
              file,
              customTags: opt.customTags,
              customAttributes: opt.customAttributes,
              partialFiles: partials,
              onBeforeRender: traverseNode(pagesDirectoryPath)
            })
            
            if (isProduction) {
              // cache the html content so it can be used for CSS purge
              await cacheService.cacheFile(filePath, html);
            }
            
            callback(null, html);
          } catch (e) {
            console.error(e.message);
            
            if (isProduction) {
              return callback(e)
            }
            
            const cleanMsg = e.message
              .replace(/\[\d+m/g, '')
              .replace(/([><])/g, m => m === '<' ? '&lt;' : '&gt;');
            
            callback(null, `<pre>${cleanMsg}</pre>`);
          }
        })
      });
      
      app.set('views', pagesDirectoryPath);
      app.set('view engine', 'html');
      
      console.info(chalk.green('[HTML+] engine is ready'));
      
      return new Router(app, {pagesRoutes, pagesDirectoryPath, options: opt});
    })
};

module.exports.engine = engine;
