const {File} = require('./../File');
const fs = require('fs');
const {mkdir, rmdir, copyFile, writeFile} = require('fs/promises');
const path = require('path');
const chalk = require("chalk");
const {uniqueAlphaNumericId} = require("../utils/unique-alpha-numeric-id");
const {extractPartials} = require("./extract-partials");
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

async function build(options = defaultOptions) {
  options = {...defaultOptions, ...options, env: 'production'};
  
  if (!options.srcDir) {
    throw new Error('The build option "srcDir" is required to find all assets, partials and resources linked to the template.')
  }
  
  if (!fs.existsSync(options.srcDir)) {
    throw new Error('Source directory not found: ' + options.srcDir)
  }
  
  return getDirectoryFilesDetail(options.srcDir, 'html')
    .then(async files => {
      options.partialFiles = extractPartials(files, options.srcDir);
      let pages;
  
      if (fs.existsSync(options.destDir)) {
        await rmdir(options.destDir, {recursive: true});
      }
  
      await mkdir(options.destDir);
      await mkdir(path.join(options.destDir, 'stylesheets'));
      await mkdir(path.join(options.destDir, 'scripts'));
      await mkdir(path.join(options.destDir, 'assets'));
      
      if (options.template) {
        if (options.templateContextDataList.length) {
          console.log(`Building template ${chalk.green(options.template)} for ${chalk.greenBright(options.templateContextDataList.length)} data entries...`);
          pages = options.templateContextDataList.map(contextData => processPage(options.template, {
            ...options,
            contextData,
          }))
        } else {
          processPage(options.template, {
            ...options,
            get contextData() {
              return typeof options.contextDataProvider === 'function'
                ? options.contextDataProvider(options.template)
                : {};
            },
          });
        }
  
        pages.forEach(pg => {
          const pagePath = path.join(options.destDir, pg.file.filePath)

          mkdir(path.join(
            options.destDir,
            pg.file.fileDirectoryPath.replace(options.srcDir, '')
          ), {recursive: true});

          writeFile(pagePath, pg.content);

          pg.resources.forEach(resource => {
            processPageResource(resource, options.destDir, new File(pagePath, options.destDir))
          })
        })
      } else {
        // check if source directory exists
        // read all html files inside the source directory
      }
    })
    .catch(async e => {
      await rmdir(options.destDir, {recursive: true});
      throw e;
    })
}

function processPage(pagePath, opt) {
  const resources = [];
  const file = new File(pagePath, opt.srcDir);
  
  const content = transform(file.toString(), {
    file,
    data: opt.staticData,
    context: opt.contextData,
    customTags: opt.customTags,
    customAttributes: opt.customAttributes,
    partialFiles: opt.partialFiles,
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
    file
  }
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
    
    const srcDestPath = getFileSourceHashedDestPath(srcPath);
  
    const relativePath = path.relative(nodeFile.fileDirectoryPath, nodeFile.srcDirectoryPath);
    node.setAttribute(srcAttrName, `${relativePath}/${srcDestPath}`);
    
    return {srcPath, srcDestPath};
  }
  
  return null;
}

async function processPageResource({srcPath, srcDestPath}, destPath, pageFile) {
  const env = 'production';
  const ext = path.extname(srcPath);
  const absoluteDestPath = path.join(destPath, srcDestPath);
  let content = null;
  
  switch (ext) {
    case '.sass':
    case '.scss':
      content = await transformer.sass({file: new File(srcPath, pageFile.srcDirectoryPath)});
      content = await transformer.css(content, {pageFile, destPath, env, file: new File(absoluteDestPath, pageFile.srcDirectoryPath)})
      break;
    case '.less':
      content = await transformer.less({file: new File(srcPath)});
      content = await transformer.css(content, {pageFile, destPath, env, file: new File(absoluteDestPath, pageFile.srcDirectoryPath)})
      break;
    case '.styl':
      content = await transformer.stylus({file: new File(srcPath)});
      content = await transformer.css(content, {pageFile, destPath, env, file: new File(absoluteDestPath, pageFile.srcDirectoryPath)})
      break;
    case '.css':
      content = await transformer.css({pageFile, destPath, env, file: new File(srcPath, pageFile.srcDirectoryPath)})
      break;
    case '.js':
    case '.mjs':
    case '.ts':
    case '.jsx':
    case '.tsx':
      content = await transformer.js({env, file: new File(srcPath, pageFile.srcDirectoryPath)})
      break;
    default:
      await copyFile(srcPath, absoluteDestPath)
  }
  
  if (typeof content === 'string') {
    await writeFile(absoluteDestPath, content);
  }
}

function getFileSourceHashedDestPath(src) {
  let fileDestPath = '';
  const hash = uniqueAlphaNumericId(16);
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
    case '.ts':
    case '.jsx':
    case '.tsx':
      fileDestPath = path.join('scripts', path.basename(src).replace(/\.ts|tsx|jsx$/, `-${hash}.js`))
      break;
    default:
      fileDestPath = path.join('assets', path.basename(src).replace(/\.[a-zA-Z0-9]{2,}$/, `-${hash}${ext}`))
  }
  
  return fileDestPath;
}

module.exports.build = build;
