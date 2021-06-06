const express = require('express');
const http = require('http');
const path = require('path');
const {engine} = require('../core/engine');
const pages = require('./pages/data/pages.json');
const site = require('./pages/data/site.json');
const packageJSON = require('./../package.json');

const app = express();

engine(app, path.resolve(__dirname, './pages'), {
  staticData: {
    pages,
    site,
    version: packageJSON.version
  },
  customTags: []
});

const server = http.createServer(app);

server.listen(3000, () => {
  console.log('listening on port http://localhost:3000/');
})
