const fs = require('fs');
const path = require('path');
const {PartialFile} = require("./PartialFile");
const {transform} = require('./transform');
const {getDirectoryFilesDetail} = require('./utils/getDirectoryFilesDetail');
const {File} = require('./File');

const defaultOptions = {
  staticData: {},
  customTags: []
}

module.exports.engine = (app, pagesDirectoryPath, opt = defaultOptions) => {
  opt = {
    ...defaultOptions,
    ...opt
  }
  
  if (typeof opt.staticData !== 'object') {
    throw new Error('HTML+ static data must be an javascript object')
  }
  
  if (!Array.isArray(opt.customTags)) {
    throw new Error('HTML+ custom tags must be an array of Tag or a function which returns a tag-like object')
  }
  
  getDirectoryFilesDetail(pagesDirectoryPath, 'html')
    .then(files => {
      const {partials, pagesRoutes} = files.reduce((acc, file) => {
        if (file.item.startsWith('_')) {
          acc.partials.push(new PartialFile(file.itemPath, pagesDirectoryPath))
        } else {
          const template = `${file.itemRelativePath.replace(file.ext, '')}`.slice(1);
          
          if (file.itemRelativePath.endsWith('index.html')) {
            acc.pagesRoutes[file.itemRelativePath.replace('index.html', '')] = template;
          } else {
            acc.pagesRoutes[file.itemRelativePath.replace(file.ext, '')] = template;
          }
          
          acc.pagesRoutes[file.itemRelativePath.replace(/\/$/, '')] = template;
        }
        
        return acc;
      }, {partials: [], pagesRoutes: {}});
      
      app.engine('html', (filePath, {settings, _locals, cache, ...data}, callback) => {
        const fileName = path.basename(filePath);
        
        if (fileName.startsWith('_')) {
          callback(new Error(`Cannot render partial(${fileName}) file as page. Partial files can only be included.`));
        }
        
        fs.readFile(filePath, async (err, content) => {
          if (err) return callback(err);
          const fileObject = new File(filePath, settings.views);
          fileObject.content = content.toString();
          try {
            const result = await transform(fileObject.content, {
              data: {...opt.staticData, ...data},
              fileObject,
              customTags: opt.customTags,
              partialFileObjects: partials
            })
            
            callback(null, result);
          } catch (e) {
            callback(new Error(e.message));
          }
        })
      });
      
      app.set('views', pagesDirectoryPath);
      app.set('view engine', 'html');
  
      app.use((req, res) => {
        const template = pagesRoutes[req.path] ?? pagesRoutes[`${req.path}/`] ?? pagesRoutes['/404'];
    
        if (template) {
          res.render(template)
        } else {
          res.send('<h1>404 - Page Not Found</h1>')
        }
      })
      
      console.log('HTML+ templates ready');
    })
}