const {sassTransformer} = require('./sass.transformer');
const {stylusTransformer} = require('./stylus.transformer');
const {cssTransformer} = require('./css.transformer');
const {lessTransformer} = require('./less.transformer');
const {jsTransformer} = require('./js.transformer');

const transform = {
  sass: sassTransformer,
  less: lessTransformer,
  stylus: stylusTransformer,
  css: cssTransformer,
  js: jsTransformer
};

module.exports.transform = transform;