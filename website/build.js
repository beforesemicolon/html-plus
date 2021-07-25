const {build} = require('./../core/builder');
const path = require('path');
const documentationPage = require('./data/documentation.page');
const {collectPaths} = require("./data/collect-paths");

const paths = collectPaths(documentationPage.menu.list);

build({
  srcDir: path.resolve(__dirname, './pages'),
  destDir: path.resolve(__dirname, '../docs'),
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
