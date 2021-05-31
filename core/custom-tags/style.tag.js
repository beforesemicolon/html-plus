const {Tag} = require('../Tag');
const {cssTransformer} = require('../transformers/css.transformer');
const {sassTransformer} = require('../transformers/sass.transformer');
const {lessTransformer} = require('../transformers/less.transformer');
const {stylusTransformer} = require('../transformers/stylus.transformer');

const supportedCSSTypes = ['css', 'scss', 'sass', 'styl', 'less'];

class Style extends Tag {
  constructor(tagInfo) {
    super(tagInfo);
    
    const {innerHTML, fileObject, env} = tagInfo;
    
    this.content = innerHTML;
    const shouldProcess = !this.attributes.hasOwnProperty('href') && this.content.trim().length;
  
    if (shouldProcess) {
      const type = this.attributes['compiler'] ||  'css';
    
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
    compiler: {bind: false}
  }
  
  async render() {
    const content = await (async () => this.content)();
    return this.composeTagString(content, Style.customAttributes);
  }
}

module.exports.Style = Style;