const path = require('path');
const {collectHPConfig} = require("../utils/collect-hp-config");
const chalk = require("chalk");
const serialize = require('serialize-javascript');
const {traverseSourceDirectoryAndCollect} = require("./traverse-source-directory-and-collect");
const {transform} = require('../transform');
const {getDirectoryFilesDetail} = require('../utils/getDirectoryFilesDetail');
const {File} = require('../File');
const {traverseNode} = require("./traverse-node");
const {Router} = require("./Router");
const {isObject, isArray, isFunction} = require("util");
const {defaultOptions} = require("./default-options");
const {cacheService} = require('../CacheService');

const engine = (app, pagesDirectoryPath, opt = {}) => {
  if (!app) {
    throw new Error('engine first argument must be provided and be a valid express app.')
  }
  
  opt = collectHPConfig(opt, defaultOptions);
  
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
    traverseSourceDirectoryAndCollect(pagesDirectoryPath, partials, pagesRoutes, opt.env)
  )
    .then(async () => {
      await cacheService.init();
      
      app.engine('html', async function (filePath, {settings, _locals, cache, ...context}, callback) {
        const fileName = path.basename(filePath);
        
        if (fileName.startsWith('_')) {
          callback(new Error(`Cannot render partial(${fileName}) file as page. Partial files can only be included.`));
        }
        
        const file = new File(filePath, pagesDirectoryPath);
  
        if (isProduction) {
          const cachedPage = await cacheService.getCachedFile(`${serialize(context)}${filePath}`);
    
          if (cachedPage) {
            return callback(null, cachedPage);
          }
    
          if (cacheService.hasCachedFile(filePath)) {
            file.content = await cacheService.getCachedFile(filePath);
          }
        }
  
        if (!file.content) {
          file.load();
        }
  
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
  
          callback(null, html);
    
          if (isProduction) {
            await cacheService.cacheFile(`${serialize(context)}${filePath}`, html);
            await cacheService.cacheFile(filePath, file.content);
          }
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
      });
      
      app.set('views', pagesDirectoryPath);
      app.set('view engine', 'html');
      
      console.info(chalk.green('[HTML+] engine is ready'));
      
      return new Router(app, {pagesRoutes, pagesDirectoryPath, options: opt});
    })
};

module.exports.engine = engine;
