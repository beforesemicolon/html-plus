const {build} = require('./../core/builder');
const path = require('path');
const documentationPage = require('./data/documentation.page');
const {collectPaths} = require("./data/collect-paths");

const paths = collectPaths(documentationPage.menu.list);
const env = process.env.NODE_ENV || 'development';

build({
  srcDir: path.resolve(__dirname, './src'),
  destDir: path.resolve(__dirname, '../docs'),
  contextDataProvider: (page) => {
    return {path: page.path, env}
  },
  templates: [
    {
      path: path.resolve(__dirname, './src/documentation/index.html'),
      dataList: Array.from(paths, dt => ([dt, {path: dt, env}]))
    }
  ]
})
  .catch(e => {
    console.log('build failed', e);
  })
