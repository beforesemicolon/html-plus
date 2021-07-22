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
const validUrl = require('valid-url');
const {collectPageTagsStyle} = require("../utils/collect-page-tags-style");
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
  const tagStyles = {};
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
        const tagsStylesheetName = `${file.filePath.replace(file.file, '')}tags.css`;
  
        if (isProduction) {
          const cachedPage = await cacheService.getCachedFile(`${serialize(context)}${filePath}`);
    
          if (cachedPage) {
            return callback(null, cachedPage);
          }
    
          if (cacheService.hasCachedValue(filePath)) {
            file.content = await cacheService.getCachedValue(filePath);
          }
        }
  
        if (!file.content) {
          file.load();
        }
  
        const usedTagsWithStyle = new Set();
        let customTags = null;
  
        try {
          const onBeforeRender = traverseNode(pagesDirectoryPath);
          
          let html = transform(file.content, {
            data: opt.staticData,
            context,
            file,
            customTags: opt.customTags,
            customAttributes: opt.customAttributes,
            partialFiles: partials,
            onBeforeRender: (node, nodeFile) => {
              if (!customTags) {
                customTags = node._options.customTags;
              }
  
              // collect any tag style if not already collected
              if (node._options.customTags[node.tagName] && !usedTagsWithStyle.has(node.tagName) && node._options.customTags[node.tagName].style) {
                usedTagsWithStyle.add(node.tagName)
              }
  
              onBeforeRender(node, nodeFile)
            }
          })
  
          // include the collected styles at the end of the head tag
          if (usedTagsWithStyle.size) {
            const endOfHeadPattern = /<\/head>/gm;
            let styles = tagStyles[tagsStylesheetName];
    
            if (!styles) {
              styles = await collectPageTagsStyle(usedTagsWithStyle, customTags);
              tagStyles[tagsStylesheetName] = styles;
            }
    
            if (opt.env === 'development') {
              html = html.replace(endOfHeadPattern, m => {
                return `${styles.map((css) => `<style>${css}</style>`).join('\n')}${m}`;
              })
            } else {
              html = html.replace(endOfHeadPattern, m => {
                return `<link rel="stylesheet" href="${tagsStylesheetName}">${m}`;
              })
            }
          }
  
          callback(null, html);
    
          if (isProduction) {
            await cacheService.cacheFile(`${serialize(context)}${filePath}`, html);
            await cacheService.cache(filePath, file.content);
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
      
      return new Router(app, {pagesRoutes, pagesDirectoryPath, options: {
          ...opt,
          get tagStyles() {
            return tagStyles
          }
        }});
    })
};

module.exports.engine = engine;
