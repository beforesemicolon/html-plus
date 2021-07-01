const {build} = require('./../core/builder');
const path = require('path');
const documentationPage = require('./data/documentation.page');
const site = require('./data/site.json');
const packageJSON = require('./../package.json');
const {CodeSnippet} = require("./tags/code-snippet");

const documentTemplate = path.resolve(__dirname, './pages/documentation/index.html');

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
  destDir: path.resolve(__dirname, './public'),
  staticData: {
    pages: {
      documentation: documentationPage
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
  template: documentTemplate,
  // templateContextDataList: Array.from(paths, (dt) => ({path: dt})),
  templateContextDataList: [{path: '/documentation/getting-started'}],
})
  .then(res => {
    console.log('-- done', res);
  })
  .catch(e => {
    console.log('-- failed', e);
  })