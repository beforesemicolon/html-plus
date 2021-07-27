const {getFileSourceHashedDestPath} = require("./get-file-source-hashed-dest-path");
const {transform} = require("../../transformers");
const {File} = require("../../File");
const {copyFile, writeFile} = require('fs/promises');
const path = require('path');
const purgeHTML = require('purgecss-from-html');
const {readFileContent} = require("../../utils/readFileContent");

function htmlExtractor(fileName) {
  return content => {
    if (content.match(new RegExp(`${fileName}`, 'g'))) {
      return purgeHTML(content);
    }
    
    return [];
  }
}

async function processPageResource({srcPath, srcDestPath, pageFile, type}, options, resources) {
  const env = 'production';
  const ext = path.extname(srcPath);
  const {destDir, sass, less, postCSS, stylus} = options;
  const destPath = destDir;
  const file = new File(srcPath, pageFile.srcDirectoryPath);
  const absoluteDestPath = path.join(destPath, srcDestPath);
  const destFile = new File(absoluteDestPath, destPath);
  const assetsPath = `../assets`;
  const assetsHashedMap = resources;
  let content;
  let linkedResources;
  
  switch (ext) {
    case '.sass':
    case '.scss':
      content = await transform.sass({file, ...sass});
      ({content, linkedResources} = await transform.css(content, {
        pageFile,
        destPath,
        env,
        file: destFile,
        assetsPath,
        assetsHashedMap
      }));
      break;
    case '.less':
      content = await transform.less({file, ...less});
      ({content, linkedResources} = await transform.css(content, {
        pageFile,
        destPath,
        env,
        file: destFile,
        assetsPath,
        assetsHashedMap
      }))
      break;
    case '.styl':
      content = await transform.stylus({file, ...stylus});
      ({content, linkedResources} = await transform.css(content, {
        pageFile,
        destPath,
        env,
        file: destFile,
        assetsPath,
        assetsHashedMap
      }))
      break;
    case '.css':
      ({content, linkedResources} = await transform.css({
        ...postCSS, pageFile, destPath, env, file, assetsPath, assetsHashedMap,
        // need to provide the html extractor because the source file and the destination file
        // are two different things
        htmlExtractor: htmlExtractor(destFile.file)
      }))
      break;
    case '.js':
    case '.mjs':
    case '.ts':
    case '.jsx':
    case '.tsx':
      ({content, linkedResources} = await transform.js({env, file}));
      break;
    case '.json':
      if (type === 'manifest') {
        const fileName = path.basename(srcPath);
        const dir = srcPath.replace(fileName, '');
        const manifest = JSON.parse(readFileContent(srcPath));
        linkedResources = [];
  
        manifest.icons.forEach(icon => {
          linkedResources.push(path.resolve(dir, icon.src));
          // update the src path to point to the destination directory
          icon.src = `./${path.basename(icon.src)}`
        })
  
        content = JSON.stringify(manifest, null, 2);
      }
      break;
    default:
      await copyFile(srcPath, absoluteDestPath)
  }
  
  if (typeof content === 'string') {
    await writeFile(absoluteDestPath, content);
    // log so the user can track it
    console.log(absoluteDestPath.replace(process.cwd(), ''));
    
    for (let source of linkedResources) {
      if (!resources[source].copied) {
        const srcDestPath = path.join(destPath, getFileSourceHashedDestPath(source, resources[source].hash));
        resources[source].copied = true;
        // log so the user can track it
        console.log(source.replace(process.cwd(), ''));
        
        try {
          await copyFile(source, srcDestPath).catch();
        } catch (e) {
          console.error(`Asset not found: ${source} in ${srcPath}. This can be due to nested imports with relative path to assets.`);
        }
      }
    }
  }
}

module.exports.processPageResource = processPageResource;
