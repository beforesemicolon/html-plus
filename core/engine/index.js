const fs = require('fs');
const path = require('path');
const {pageAndResourcesMiddleware} = require("./page-and-resources-middleware");
const {extractPartialAndPageRoutes} = require("./extract-partial-and-page-routes");
const {transform} = require('../transform');
const {getDirectoryFilesDetail} = require('../utils/getDirectoryFilesDetail');
const {File} = require('../File');

const defaultOptions = {
  staticData: {},
  customTags: [],
  customAttributes: [],
  env: 'development',
  onPageRequest() {}
}

const engine = (app, pagesDirectoryPath, opt = defaultOptions) => {
  opt = {...defaultOptions, ...opt}
  
  if (typeof opt.staticData !== 'object') {
    throw new Error('HTML+ static data must be an javascript object')
  }
  
  if (!Array.isArray(opt.customTags)) {
    throw new Error('HTML+ custom tags must be an array of valid tags.')
  }
  
  if (typeof opt.onPageRequest !== 'function') {
    throw new Error('"onPageRequest" option must be a function')
  }
  
  if (!['development', 'production'].includes(opt.env)) {
    opt.env = 'development';
    console.warn('HTML+ swapped "ENV" to development because the value provided is not a supported one.')
  }
  
  getDirectoryFilesDetail(pagesDirectoryPath, 'html')
    .then(files => {
      const {partials, pagesRoutes} = extractPartialAndPageRoutes(files, pagesDirectoryPath)
      
      app.engine('html', (filePath, {settings, _locals, cache, ...context}, callback) => {
        const fileName = path.basename(filePath);
        
        if (fileName.startsWith('_')) {
          callback(new Error(`Cannot render partial(${fileName}) file as page. Partial files can only be included.`));
        }
        
        fs.readFile(filePath, (err, content) => {
          if (err) return callback(err);
          const fileObject = new File(filePath, settings.views);
          fileObject.content = content.toString();
          try {
            const result = transform(fileObject.content, {
              data: opt.staticData,
              context,
              fileObject,
              customTags: opt.customTags,
              customAttributes: opt.customAttributes,
              partialFileObjects: partials,
              onTraverse: (node, file) => {
                let attrName = '';
                
                if (node.tagName === 'link') {
                  attrName = 'href';
                } else if (node.tagName === 'script') {
                  attrName = 'src';
                }
  
                const srcPath = node.attributes[attrName];
                let isURL = false;
                
                try {
                  new URL(srcPath);
                  isURL = true;
                } catch(e) {}
                
                if (srcPath && !isURL) {
                  const resourceFullPath = path.resolve(file.fileDirectoryPath, srcPath);
    
                  if (resourceFullPath.startsWith(pagesDirectoryPath)) {
                    node.setAttribute(attrName, resourceFullPath.replace(pagesDirectoryPath, ''))
                  }
                }
              }
            })
            
            callback(null, result);
          } catch (e) {
            console.log(e.message);
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
      ))
      
      console.log('HTML+ engine is ready');
    })
};

module.exports.engine = engine;
