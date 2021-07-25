const fs = require('fs');
const {mkdir, rmdir, writeFile} = require('fs/promises');
const path = require('path');
const chalk = require("chalk");
const {collectHPConfig} = require("../utils/collect-hp-config");
const {processPageResource} = require("./utils/process-page-resource");
const {processPage} = require("./utils/process-page");
const {collectFilePaths} = require("./utils/collect-file-paths");
const {getDirectoryFilesDetail} = require("../utils/getDirectoryFilesDetail");

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
  console.time(chalk.cyan('\ntotal duration'));
  console.log(chalk.blue('\nReading source directory'));
  console.time(chalk.blue('reading duration'));
  return getDirectoryFilesDetail(options.srcDir, collectFilePaths(options.srcDir, {partials, pages, resources}))
    .then(async () => {
      console.timeEnd(chalk.blue('reading duration'));
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
            processPage(page, path.basename(page), resources, {...options, contextData, partials}),
            pageResources,
            options
          );
          
          console.timeEnd(logMsg);
        })
      )
      
      console.timeEnd(chalk.cyan('build duration'));
  
      if (options.templates.length) {
        console.log(chalk.cyan('\nBuilding dynamic pages...'));
        console.time(chalk.cyan('build duration'));
        for (let template of options.templates) {
          for (let [filePath, contextData] of template.dataList) {
            const logMsg = chalk.green(`${filePath} `).padEnd(75, '-');
            console.time(logMsg);
            let fileName = path.basename(filePath);

            if (!fileName.endsWith('.html')) {
              fileName += '.html';
              filePath += '.html';
            }

            await handleProcessedPageResult(
              processPage(template.path, fileName, resources, {...options, contextData, partials}, filePath),
              pageResources,
              options,
              filePath
            );

            console.timeEnd(logMsg);
          }
        }
        console.timeEnd(chalk.cyan('build duration'));
      }
  
      console.log(chalk.greenBright('\nProcessing pages connected resources...'));
      console.time(chalk.greenBright('processing duration'));
      await Promise.all(
        Object.values(pageResources).map(resource => {
          console.log(resource.srcPath.replace(process.cwd(), ''));
          return processPageResource(resource, options.destDir, resources)
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
