const fs = require('fs');
const {mkdir, rmdir, writeFile} = require('fs/promises');
const path = require('path');
const chalk = require("chalk");
const {collectHPConfig} = require("../utils/collect-hp-config");
const {processPageResource} = require("./utils/process-page-resource");
const {processPage} = require("./utils/process-page");
const {collectFilePaths} = require("./utils/collect-file-paths");
const {getDirectoryFilesDetail} = require("../utils/getDirectoryFilesDetail");
const {turnCamelOrPascalToKebabCasing} = require("../utils/turn-camel-or-pascal-to-kebab-casing");
const {defaultAttributesMap} = require("../parser/default-attributes");
const {customAttributesRegistry} = require("../parser/default-attributes/CustomAttributesRegistry");
const {defaultTagsMap} = require("../parser/default-tags");
const {customTagsRegistry} = require("../parser/default-tags/CustomTagsRegistry");

const defaultOptions = {
  // absolute path to the directory containing the page, style, script and asset files
  srcDir: '',
  // absolute path to the directory where all assets and transformed page and files
  destDir: '',
  // an object containing static data for all pages
  staticData: null,
  // a callback function called with page absolute path and the corresponding path and must return a context data for the page
  contextDataProvider: null,
  // an array of custom tags to be passed to the pages
  customTags: [],
  // an array of custom attributes to be passed to the pages
  customAttributes: [],
  // an array of templates ({path: string, dataList: object[], dataProvider: fn, count: number}) to build based on their context data list
  // the equivalent on dynamic routes that use same template
  templates: []
};
let resources = {};
let partials = [];
let pages = [];

/**
 * static site builder
 * @param options
 * @returns {Promise<T>}
 */
async function build(options = defaultOptions) {
  options.env = 'production'
  options = collectHPConfig(options, defaultOptions);
  
  if (!options.srcDir) {
    throw new Error('The build option "srcDir" is required to find all assets, partials and resources linked to the template.')
  }
  
  if (!fs.existsSync(options.srcDir)) {
    throw new Error('Source directory not found: ' + options.srcDir)
  }
  
  resources = {};
  partials = [];
  pages = [];
  const customTagStyles = {};
  
  // register default and custom attributes
  for (let key in defaultAttributesMap) {
    customAttributesRegistry.define(key, defaultAttributesMap[key])
  }
  
  for (let attribute of options.customAttributes) {
    const attr = turnCamelOrPascalToKebabCasing(attribute.name);
    customAttributesRegistry.define(attr, attribute);
  }
  
  // register default and custom tags
  for (let key in defaultTagsMap) {
    customTagsRegistry.define(key, defaultTagsMap[key])
  }
  
  for (let tag of options.customTags) {
    const tagName = turnCamelOrPascalToKebabCasing(tag.name);
    customTagsRegistry.define(tagName, tag);
    customTagStyles[tagName] = tag.style;
  }
  
  console.time(chalk.cyan('\ntotal duration'));
  return getDirectoryFilesDetail(options.srcDir, collectFilePaths(options.srcDir, {partials, pages, resources}))
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
      // Build pages
      console.log(chalk.cyan('\nBuilding static pages...'));
      console.time(chalk.cyan('build duration'));
      await Promise.all(
        pages.map(async page => {
          const pageRoutePath = page
            .replace(options.srcDir, '')
            .replace(/\/index\.html$/, '')
            .replace(/\.html$/, '') || '/';
          
          const logMsg = chalk.green(`${pageRoutePath} `).padEnd(75, '-');
          console.time(logMsg);
          
          const contextData = typeof options.contextDataProvider === 'function'
            ? options.contextDataProvider({file: page, path: pageRoutePath})
            : {}
          
          await handleProcessedPageResult(
            await processPage(page, path.basename(page), resources, {...options, contextData, partials, customTagStyles}),
            pageResources,
            options
          );
          
          console.timeEnd(logMsg);
        })
      )
      
      console.timeEnd(chalk.cyan('build duration'));
      
      // Build template pages
      if (options.templates.length) {
        console.log(chalk.cyan('\nBuilding dynamic pages...'));
        console.time(chalk.cyan('build duration'));
        for (let template of options.templates) {
          console.log('Template:', chalk.cyan(template.path), '\nPaths:');
          await Promise.all(
            template.dataList.map(async ([filePath, contextData], i) => {
              console.log(chalk.cyan(filePath));
              let fileName = path.basename(filePath);

              if (!fileName.endsWith('.html')) {
                fileName += '.html';
                filePath += '.html';
              }
  
              await handleProcessedPageResult(
                await processPage(template.path, fileName, resources, {...options, contextData, partials, customTagStyles}, filePath),
                pageResources,
                options,
                filePath,
              );
            })
          );
        }
        console.timeEnd(chalk.cyan('build duration'));
      }
      
      // Processing page resources
      console.log(chalk.greenBright('\nProcessing pages connected resources...'));
      console.time(chalk.greenBright('processing duration'));
      await Promise.all(
        Object.values(pageResources).map(resource => {
          return processPageResource(resource, options, resources)
        })
      )
      console.timeEnd(chalk.greenBright('processing duration'));

      console.timeEnd(chalk.cyan('\ntotal duration'));
    })
    .catch(async e => {
      await rmdir(options.destDir, {recursive: true});
      throw e;
    })
}

async function handleProcessedPageResult({content, linkedSources, file}, pageResources, options, filePath) {
  linkedSources.forEach(rsc => {
    pageResources[rsc.srcPath] = rsc;
  });
  
  let pageDestPath = '';
  let pageDir = ''
  
  if (filePath) {
    pageDestPath = path.join(options.destDir, filePath);
    pageDir = path.join(
      options.destDir,
      filePath.replace(path.basename(filePath), '')
    );
  } else {
    pageDestPath = path.join(options.destDir, file.filePath);
    pageDir = path.join(
      options.destDir,
      file.fileDirectoryPath.replace(options.srcDir, '')
    )
  }
  
  await mkdir(pageDir, {recursive: true});
  await writeFile(pageDestPath, content);
}

module.exports.build = build;
