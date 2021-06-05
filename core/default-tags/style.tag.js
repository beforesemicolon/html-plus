const {composeTagString} = require("./../utils/compose-tag-string");
const {cssTransformer} = require('../transformers/css.transformer');
const {sassTransformer} = require('../transformers/sass.transformer');
const {lessTransformer} = require('../transformers/less.transformer');
const {stylusTransformer} = require('../transformers/stylus.transformer');

const supportedCSSTypes = ['css', 'scss', 'sass', 'styl', 'less'];

class Style {
  constructor(node, options) {
    const {fileObject, env} = options;
    const {innerHTML, attributes} = node;
    
    this.node = node;
    this.content = innerHTML;
    const shouldProcess = !attributes.hasOwnProperty('href') && this.content.trim().length;

    if (shouldProcess) {
      const type = attributes['compiler'] ||  'css';
    
      if (supportedCSSTypes.includes(type)) {
        // transformers are async so content will have a promise
        switch (type) {
          case 'css':
            this.content = cssTransformer(this.content, {fileObject, env});
            break;
          case 'sass':
          case 'scss':
            this.content = sassTransformer(this.content, {fileObject, env});
            break;
          case 'less':
            this.content = lessTransformer(this.content, {fileObject, env});
            break;
          case 'styl':
            this.content = stylusTransformer(this.content, {fileObject, env});
            break;
        }
      }
    }
  }
  
  static customAttributes = {
    compiler: null
  }
  
  async render() {
    const content = await (async () => this.content)();
    return composeTagString(this.node, content, Object.keys(Style.customAttributes))
  }
}

module.exports.Style = Style;