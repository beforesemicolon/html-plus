const {getFileSourceHashedDestPath} = require("./get-file-source-hashed-dest-path");
const {transform} = require("../../transformers");
const {File} = require("../../File");
const {copyFile, writeFile} = require('fs/promises');
const path = require('path');

async function processPageResource({srcPath, srcDestPath, pageFile}, destPath, resources) {
  const env = 'production';
  const ext = path.extname(srcPath);
  const absoluteDestPath = path.join(destPath, srcDestPath);
  const file = new File(srcPath, pageFile.srcDirectoryPath);
  const destFile = new File(absoluteDestPath, destPath);
  const assetsPath = `../assets`;
  const assetsHashedMap = resources;
  let content;
  let linkedResources;
  
  switch (ext) {
    case '.sass':
    case '.scss':
      content = await transform.sass({file});
      ({content, linkedResources} = await transform.css(content, {pageFile, destPath, env, file: destFile, assetsPath, assetsHashedMap}));
      break;
    case '.less':
      content = await transform.less({file});
      ({content, linkedResources} = await transform.css(content, {pageFile, destPath, env, file: destFile, assetsPath, assetsHashedMap}))
      break;
    case '.styl':
      content = await transform.stylus({file});
      ({content, linkedResources} = await transform.css(content, {pageFile, destPath, env, file: destFile, assetsPath, assetsHashedMap}))
      break;
    case '.css':
      ({content, linkedResources} = await transform.css({pageFile, destPath, env, file, assetsPath, assetsHashedMap}))
      break;
    case '.js':
    case '.mjs':
    case '.ts':
    case '.jsx':
    case '.tsx':
      ({content, linkedResources} = await transform.js({env, file}));
      break;
    default:
      await copyFile(srcPath, absoluteDestPath)
  }
  
  if (typeof content === 'string') {
    await writeFile(absoluteDestPath, content);
    
    for (let source of linkedResources) {
      if (!resources[source].copied) {
        const srcDestPath = path.join(destPath, getFileSourceHashedDestPath(source, resources[source].hash));
        resources[source].copied = true;
        console.log(source.replace(process.cwd(), ''));
        
        try {
          await copyFile(source, srcDestPath).catch();
        } catch(e) {
          console.error(`Asset not found: ${source} in ${srcPath}. This can be due to nested imports with relative path to assets.`);
        }
      }
    }
  }
}

module.exports.processPageResource = processPageResource;