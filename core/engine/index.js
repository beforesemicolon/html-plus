const path = require('path');
const {collectHPConfig} = require("../utils/collect-hp-config");
const chalk = require("chalk");
const serialize = require('serialize-javascript');
const {traverseSourceDirectoryAndCollect} = require("./traverse-source-directory-and-collect");
const {getDirectoryFilesDetail} = require('../utils/getDirectoryFilesDetail');
const {File} = require('../parser/File');
const {traverseNode} = require("./traverse-node");
const {Router} = require("./Router");
const {collectPageTagsStyle} = require("./collect-page-tags-style");
const {isObject, isArray, isFunction} = require("util");
const {defaultOptions} = require("./default-options");
const {cacheService} = require('../CacheService');
const {injectTagStylesToPage} = require("./inject-tag-styles-to-page");
const {turnCamelOrPascalToKebabCasing} = require("../utils/turn-camel-or-pascal-to-kebab-casing");
const {defaultAttributesMap} = require("../parser/default-attributes");
const {customAttributesRegistry} = require("../parser/default-attributes/CustomAttributesRegistry");
const {defaultTagsMap} = require("../parser/default-tags");
const {customTagsRegistry} = require("../parser/default-tags/CustomTagsRegistry");
const {render} = require("../parser/render");

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
  const customTagStyles = {};
  
  // register default and custom attributes
  for (let key in defaultAttributesMap) {
    customAttributesRegistry.define(key, defaultAttributesMap[key])
  }
  
  for (let attribute of opt.customAttributes) {
    const attr = turnCamelOrPascalToKebabCasing(attribute.name);
    customAttributesRegistry.define(attr, attribute);
  }
  
  // register default and custom tags
  for (let key in defaultTagsMap) {
    customTagsRegistry.define(key, defaultTagsMap[key])
  }
  
  for (let tag of opt.customTags) {
    const tagName = turnCamelOrPascalToKebabCasing(tag.name);
    customTagsRegistry.define(tagName, tag);
    customTagStyles[tagName] = tag.style;
  }
  
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
    
          if (cacheService.hasCachedValue(filePath)) {
            file.content = await cacheService.getCachedValue(filePath);
          }
        }
  
        if (!file.content) {
          file.load();
        }
  
        const usedTagsWithStyle = new Set();
  
        try {
          const onBeforeRender = traverseNode(pagesDirectoryPath);
  
          let html = render({
            file,
            content: file.content,
            partialFiles: partials,
            context: {$data: opt.staticData, ...context},
            onRender: (node, nodeFile) => {
              // collect any tag style if not already collected
              if (customTagStyles[node.tagName] && !usedTagsWithStyle.has(node.tagName)) {
                usedTagsWithStyle.add(node.tagName)
              }
  
              if (!customTagStyles[node.tagName] && !defaultTagsMap[node.tagName]) {
                onBeforeRender(node, nodeFile)
              }
            }
          })
  
          // include the collected styles at the end of the head tag
          if (usedTagsWithStyle.size) {
            html = injectTagStylesToPage(html, await collectPageTagsStyle(usedTagsWithStyle, customTagStyles))
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
      
      return new Router(app, {pagesRoutes, pagesDirectoryPath, options: opt});
    })
};

module.exports.engine = engine;
