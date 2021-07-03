const {File} = require('./../File');
const fs = require('fs');
const {mkdir, rmdir, copyFile, writeFile} = require('fs/promises');
const path = require('path');
const {processPageResource} = require("./utils/process-page-resource");
const {processPage} = require("./utils/process-page");
const {collectFilePaths} = require("./utils/collect-file-paths");
const {PartialFile} = require("../PartialFile");
const {uniqueAlphaNumericId} = require("../utils/unique-alpha-numeric-id");
const {getDirectoryFilesDetail} = require("../utils/getDirectoryFilesDetail");
const {transform} = require("../transform");

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
  return getDirectoryFilesDetail(options.srcDir, collectFilePaths(options.destDir, {partials, pages, resources}))
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
    
          const {content, linkedSources, file} = processPage(page, path.basename(page), resources, {...options, contextData, partials});
  
          linkedSources.forEach(rsc => {
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
        Object.values(pageResources).map(resource => processPageResource(resource, options.destDir, resources))
      )
      
      console.timeEnd('\nDone');
    })
    .catch(async e => {
      await rmdir(options.destDir, {recursive: true});
      throw e;
    })
}

module.exports.build = build;
