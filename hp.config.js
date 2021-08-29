const homePage = require('./website/data/home.page');
const documentationPage = require('./website/data/documentation.page');
const learnPage = require('./website/data/learn.page');
const site = require('./website/data/site');
const packageJSON = require('./package.json');
const {CodeSnippet} = require('./website/src/tags/code-snippet');
const {SearchField} = require('./website/src/tags/search-field');
const {ApiTableDetails} = require('./website/src/tags/api-table-details');
const {ContentNavigation} = require('./website/src/tags/content-navigation');
const {ApiDescriptionList} = require('./website/src/tags/api-description-list');

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
    CodeSnippet, SearchField, ApiTableDetails, ContentNavigation, ApiDescriptionList
  ]
}
