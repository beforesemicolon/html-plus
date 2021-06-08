const express = require('express');
const http = require('http');
const path = require('path');
const {engine} = require('../core/engine');
const homePage = require('./data/home.page');
const documentationPage = require('./data/documentation.page');
const learnPage = require('./data/learn.page');
const site = require('./data/site.json');
const packageJSON = require('./../package.json');

const app = express();

engine(app, path.resolve(__dirname, './pages'), {
  staticData: {
    pages: {
      documentation: documentationPage,
      home: homePage,
      learn: learnPage,
    },
    site,
    version: packageJSON.version,
    license: packageJSON.license
  },
  customTags: [],
  onPageRequest: (req) => {
    return {
      $params: req.params,
      $query: req.query,
      $url_path: req.originalUrl
    }
  }
});

app.get('/documentation/:doc', (req, res, next) => {
  const ext = path.extname(req.path);
  
  if (!ext || ext === '.html') {
    return res.render('documentation', {
      $params: req.params,
      $query: req.query
    });
  }
  
  next();
})

const server = http.createServer(app);

server.listen(3000, () => {
  console.log('listening on port http://localhost:3000/');
})
