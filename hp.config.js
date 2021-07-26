const homePage = require('./website/data/home.page');
const documentationPage = require('./website/data/documentation.page');
const learnPage = require('./website/data/learn.page');
const site = require('./website/data/site.json');
const packageJSON = require('./package.json');
const {CodeSnippet} = require('./website/tags/code-snippet');

const env = process.env.NODE_ENV || 'development';

module.exports = {
  env,
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
    }
  },
  customTags: [
    CodeSnippet,
  ]
}
