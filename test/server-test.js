const express = require('express');
const http = require('http');
const path = require('path');
const {engine} = require('../core/engine');
const pages = require('./pages/data/pages.json');

const app = express();

engine(app, {
  staticData: {
    pages
  },
  staticDataDirectoryPath: './pages/data'
});

app.set('views', path.resolve(__dirname, './pages'));
app.set('view engine', 'html');

app.get('/', function (req, res) {
  res.render('index');
})

const server = http.createServer(app);

server.listen(1000, () => {
  console.log('listening on port 1000');
})