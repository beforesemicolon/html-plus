const {build} = require('./../core/builder');
const path = require('path');
const homePage = require('./data/home.page');
const documentationPage = require('./data/documentation.page');
const learnPage = require('./data/learn.page');
const site = require('./data/site.json');
const packageJSON = require('./../package.json');
const {CodeSnippet} = require("./tags/code-snippet");

const collectPaths = list => {
  const paths = new Set();
  
  for (let item of list) {
    if (item.hasOwnProperty('path')) {
      paths.add(item.path);
      
      if (item.list && item.list.length) {
        Array.from(collectPaths(item.list), (p) => paths.add(p))
      }
    }
  }
  
  return paths;
}

const paths = collectPaths(documentationPage.menu.list);

build({
  srcDir: path.resolve(__dirname, './pages'),
  destDir: path.resolve(__dirname, '../docs'),
  staticData: {
    pages: {
      documentation: documentationPage,
      home: homePage,
      learn: learnPage,
    },
    site: {
      ...site,
      version: packageJSON.version,
      license: packageJSON.license
    },
    params: {},
    query: {},
    path: '/'
  },
  customTags: [
    CodeSnippet,
  ],
  contextDataProvider: (page) => {
    return {path: page.path}
  },
  templates: [
    {
      path: path.resolve(__dirname, './pages/documentation/index.html'),
      dataList: Array.from(paths, dt => ([dt, {path: dt}]))
    }
  ]
})
  .catch(e => {
    console.log('build failed', e);
  })