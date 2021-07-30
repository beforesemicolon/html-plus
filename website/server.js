const express = require('express');
const http = require('http');
const path = require('path');
const {engine} = require('../core/engine');
const documentationPage = require('./data/documentation.page');
const {collectPaths} = require("./data/collect-paths");

const app = express();
const paths = collectPaths(documentationPage.menu.list);
const port = process.env.PORT || 3000;
const env = process.env.NODE_ENV || 'development';

(async () => {
  app.get('/documentation/:group/:doc?', (req, res, next) => {
    const ext = path.extname(req.path);
    
    if (!ext || ext === '.html') {
      const fullPath = req.path.replace(/(\/|\.html)$/, '');
      
      if (paths.has(fullPath)) {
        return res.render('documentation', {
          path: fullPath,
          env
        });
      } else {
        return res.redirect('/404')
      }
    }
    
    next();
  })
  
  await engine(app, path.resolve(__dirname, './src'), {
    onPageRequest: (req) => {
      const fullPath = req.path.replace(/(\/|\.html)$/, '');
      return {
        path: fullPath,
        env
      }
    }
  });
  
  const server = http.createServer(app);
  
  server.listen(port, () => {
    console.log(`listening on port http://localhost:${port}/`);
  })
})()

