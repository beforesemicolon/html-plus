const express = require('express');
const http = require('http');
const path = require('path');
const {engine} = require('../core/engine');
const homePage = require('./data/home.page');
const documentationPage = require('./data/documentation.page');
const learnPage = require('./data/learn.page');
const {CodeSnippet} = require('./tags/code-snippet');
const site = require('./data/site.json');
const packageJSON = require('./../package.json');
const {collectPaths} = require("./data/collect-paths");

const app = express();
const env = process.env.NODE_ENV || 'development';
const paths = collectPaths(documentationPage.menu.list);

(async () => {
  await engine(app, path.resolve(__dirname, './pages'), {
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
      },
      params: {},
      query: {},
      path: '/'
    },
    customTags: [
      CodeSnippet,
    ],
    onPageRequest: (req) => {
      const fullPath = req.path.replace(/(\/|\.html)$/, '');
      return {
        path: fullPath
      }
    }
  });
  
  app.get('/documentation/:group/:doc?', (req, res, next) => {
    const ext = path.extname(req.path);
    
    if (!ext || ext === '.html') {
      const fullPath = req.path.replace(/(\/|\.html)$/, '');
      
      if (paths.has(fullPath)) {
        return res.render('documentation', {
          path: fullPath
        });
      } else {
        return res.redirect('/404')
      }
    }
    
    next();
  })
  
  const server = http.createServer(app);
  
  server.listen(3000, () => {
    console.log('listening on port http://localhost:3000/');
  })
})()

