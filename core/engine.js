const fs = require('fs');
const path = require('path');
const {transform} = require('./transform');
const {FileObject} = require('./FileObject');

const defaultOptions = {
  staticData: {},
  customTags: [],
}

module.exports.engine = (app, opt = defaultOptions) => {
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
  
  app.engine('html', (filePath, {settings, _locals, cache, ...data}, callback) => {
    const fileName = path.basename(filePath);
    
    if (fileName.startsWith('_')) {
      callback(new Error(`Cannot render partial(${fileName}) file as page. Partial files can only be included.`));
    }
    
    fs.readFile(filePath, async (err, content) => {
      if (err) return callback(err);
      const fileObject = new FileObject(filePath, settings.views);
      fileObject.content = content.toString();
      try {
        const result = await transform(fileObject.content, {
          data: {...opt.staticData, ...data},
          fileObject,
          customTags: opt.customTags
        })
        
        callback(null, result);
      } catch(e) {
        callback(new Error(e.message));
      }
    })
  });
}