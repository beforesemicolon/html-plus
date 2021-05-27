const fs = require('fs');
const {transform} = require('./transform');
const {FileObject} = require('./../../controllers/FileObject');

module.exports.engine = (app, opt) => {
  opt = {
    staticData: {},
    customTags: [],
    ...opt
  }
  
  app.engine('html', (filePath, {settings, _locals, cache, ...data}, callback) => {
    fs.readFile(filePath, async (err, content) => {
      if (err) return callback(err);
      const fileObject = new FileObject(filePath, settings.views);
      fileObject.content = content.toString();
      const result = await transform(fileObject.content, {
        data: {...opt.staticData, ...data},
        fileObject,
        customTags: opt.customTags
      })
      return callback(null, result);
    })
  });
}