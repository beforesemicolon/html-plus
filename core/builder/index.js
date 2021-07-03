const {File} = require('./../File');
const fs = require('fs');
const {mkdir, rmdir, copyFile, writeFile} = require('fs/promises');
const path = require('path');
const {PartialFile} = require("../PartialFile");
const {uniqueAlphaNumericId} = require("../utils/unique-alpha-numeric-id");
const {getDirectoryFilesDetail} = require("../utils/getDirectoryFilesDetail");
const {transform} = require("../transform");
const {transform: transformer} = require("../transformers/index");

const defaultOptions = {
  srcDir: '',
  destDir: '',
  platform: 'file',
  templateContextDataList: [],
  template: '',
  staticData: null,
  contextDataProvider: null,
  customTags: [],
  customAttributes: []
};
let resources = {};
let partials = [];
let pages = [];

async function build(options = defaultOptions) {
  options = {...defaultOptions, ...options, env: 'production'};
  
  if (!options.srcDir) {
    throw new Error('The build option "srcDir" is required to find all assets, partials and resources linked to the template.')
  }
  
  if (!fs.existsSync(options.srcDir)) {
    throw new Error('Source directory not found: ' + options.srcDir)
  }
  
  resources = {};
  partials = [];
  pages = [];
  
  console.time('\nDone');
  return getDirectoryFilesDetail(options.srcDir, collectFilePaths(options.destDir))
    .then(async () => {
      // clear previous destination directory
      if (fs.existsSync(options.destDir)) {
        await rmdir(options.destDir, {recursive: true});
      }
  
      // create destination directory with all essential subdirectories
      await mkdir(options.destDir);
      await mkdir(path.join(options.destDir, 'stylesheets'));
      await mkdir(path.join(options.destDir, 'scripts'));
      await mkdir(path.join(options.destDir, 'assets'));
      
      const pageResources = {};
      
      await Promise.all(
        pages.map(async page => {
          const pageRoutePath = page
            .replace(options.srcDir, '')
            .replace(/\/index\.html$/, '')
            .replace(/\.html$/, '') || '/';
    
          const contextData = typeof options.contextDataProvider === 'function'
            ? options.contextDataProvider({file: page, path: pageRoutePath})
            : {}
    
          const {content, resources, file} = processPage(page, path.basename(page), {...options, contextData});
    
          resources.forEach(rsc => {
            pageResources[rsc.srcPath] = rsc;
          })
    
          const pageDestPath = path.join(options.destDir, file.filePath)
    
          await mkdir(path.join(
            options.destDir,
            file.fileDirectoryPath.replace(options.srcDir, '')
          ), {recursive: true});
    
          await writeFile(pageDestPath, content.replace(/\n|\s{2,}/g, ''));
        })
      )
      
      await Promise.all(
        Object.values(pageResources).map(resource => processPageResource(resource, options.destDir))
      )
      
      console.timeEnd('\nDone');
    })
    .catch(async e => {
      await rmdir(options.destDir, {recursive: true});
      throw e;
    })
}

function collectFilePaths(pagesDirectoryPath) {
  return (filePath) => {
    if (/\.html$/.test(filePath)) {
      const fileName = path.basename(filePath);
      
      if (fileName.startsWith('_')) {
        partials.push(new PartialFile(filePath, pagesDirectoryPath));
      } else {
        pages.push(filePath)
      }
    } else if(!path.basename(filePath).startsWith('_')) {
      resources[filePath] = {
        path: filePath,
        hash: uniqueAlphaNumericId(8)
      }
    }
    
    return false;
  }
}

function processPage(pagePath, fileName, opt) {
  const resources = [];
  const file = new File(pagePath, opt.srcDir);
  const fileExportName = pagePath.replace(path.basename(pagePath), fileName);

  const content = transform(file.toString(), {
    file,
    data: opt.staticData,
    context: opt.contextData,
    customTags: opt.customTags,
    customAttributes: opt.customAttributes,
    partialFiles: partials,
    env: opt.env,
    onBeforeRender: (node, nodeFile) => {
      const resource = collectAndUpdateNodeSourceLink(node, nodeFile);

      if (resource) {
        resources.push(resource);
      }
    }
  });

  return {
    content,
    resources,
    file: new File(fileExportName, opt.srcDir)
  };
}

function collectAndUpdateNodeSourceLink(node, nodeFile) {
  let srcPath = '';
  let srcAttrName = '';

  switch (node.tagName) {
    case 'link':
    case 'area':
    case 'image':
      srcPath = node.attributes.href;
      srcAttrName = 'href';
      break;
    case 'script':
    case 'img':
    case 'audio':
    case 'track':
    case 'video':
    case 'embed':
    case 'iframe':
    case 'portal':
      srcPath = node.attributes.src;
      srcAttrName = 'src';
      break;
    case 'source':
      if (node.attributes.src) {
        srcPath = node.attributes.src;
        srcAttrName = 'src';
      } else if (node.attributes.srcset) {
        srcPath = node.attributes.srcset;
        srcAttrName = 'srcset';
      }
      break;
    case 'object':
      srcPath = node.attributes.data;
      srcAttrName = 'data';
      break;
    default:
  }

  let isURL = false;

  try {
    new URL(srcPath);
    isURL = true;
  } catch (e) {
  }

  if (srcPath && typeof srcPath === 'string' && !isURL) {

    if (/node_modules\//.test(srcPath)) {
      srcPath = srcPath.replace(/^.+(?=node_modules)/, `${process.cwd()}/`);
    } else {
      srcPath = path.resolve(nodeFile.fileDirectoryPath, srcPath);
    }
    
    if (!resources[srcPath]) {
      resources[srcPath] = {
        path: srcPath,
        hash: uniqueAlphaNumericId(8)
      }
    }

    const srcDestPath = getFileSourceHashedDestPath(srcPath, resources[srcPath].hash);
    const relativePath = path.relative(nodeFile.fileDirectoryPath, nodeFile.srcDirectoryPath) || '.';
    node.setAttribute(srcAttrName, `${relativePath}/${srcDestPath}`);

    return {srcPath, srcDestPath, pageFile: nodeFile};
  }

  return null;
}

async function processPageResource({srcPath, srcDestPath, pageFile}, destPath) {
  const env = 'production';
  const ext = path.extname(srcPath);
  const absoluteDestPath = path.join(destPath, srcDestPath);
  const file = new File(srcPath, pageFile.srcDirectoryPath);
  const assetsPath = `../assets`;
  const assetsHashedMap = resources;
  let content;
  let linkedResources;
  
  switch (ext) {
    case '.sass':
    case '.scss':
      content = await transformer.sass({file: new File(srcPath, pageFile.srcDirectoryPath)});
      ({content, linkedResources} = await transformer.css(content, {pageFile, destPath, env, file, assetsPath, assetsHashedMap}));
      break;
    case '.less':
      content = await transformer.less({file: new File(srcPath)});
      ({content, linkedResources} = await transformer.css(content, {pageFile, destPath, env, file, assetsPath, assetsHashedMap}))
      break;
    case '.styl':
      content = await transformer.stylus({file: new File(srcPath)});
      ({content, linkedResources} = await transformer.css(content, {pageFile, destPath, env, file, assetsPath, assetsHashedMap}))
      break;
    case '.css':
      ({content, linkedResources} = await transformer.css({pageFile, destPath, env, file, assetsPath, assetsHashedMap}))
      break;
    // case '.js':
    // case '.mjs':
    // case '.ts':
    // case '.jsx':
    // case '.tsx':
    //   content = await transformer.js({env, file: new File(srcPath, pageFile.srcDirectoryPath)})
    //   break;
    default:
      await copyFile(srcPath, absoluteDestPath)
  }

  if (typeof content === 'string') {
    await writeFile(absoluteDestPath, content);
  
    for (let source of linkedResources) {
      if (!resources[source].copied) {
        const srcDestPath = path.join(destPath, getFileSourceHashedDestPath(source, resources[source].hash));
        resources[source].copied = true;

        try {
          await copyFile(source, srcDestPath).catch();
        } catch(e) {
          console.error(`Asset not found: ${source} in ${srcPath}. This can be due to nested imports with relative path to assets.`);
        }
      }
    }
  }
}

function getFileSourceHashedDestPath(src, hash) {
  let fileDestPath = '';
  const ext = path.extname(src);

  switch (ext) {
    case '.sass':
    case '.scss':
      fileDestPath = path.join('stylesheets', path.basename(src).replace(/\.s.ss$/, `-${hash}.css`))
      break;
    case '.less':
      fileDestPath = path.join('stylesheets', path.basename(src).replace(/\.less$/, `-${hash}.css`))
      break;
    case '.styl':
      fileDestPath = path.join('stylesheets', path.basename(src).replace(/\.styl$/, `-${hash}.css`))
      break;
    case '.css':
      fileDestPath = path.join('stylesheets', path.basename(src).replace(/\.css$/, `-${hash}.css`))
      break;
    case '.js':
    case '.mjs':
    case '.cjs':
    case '.ts':
    case '.jsx':
    case '.tsx':
      fileDestPath = path.join('scripts', path.basename(src).replace(/\.(?:c|m)?(?:t|j)sx?$/, `-${hash}.js`))
      break;
    default:
      fileDestPath = path.join('assets', path.basename(src).replace(/\.[a-zA-Z0-9]{2,}$/, `-${hash}${ext}`))
  }
  
  return fileDestPath;
}

module.exports.build = build;
