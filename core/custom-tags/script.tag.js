const {Tag} = require('../Tag');
const {jsTransformer} = require('../../../transformers/js.transformer');

const supportedJSTypes = ['js', 'ts'];

class Script extends Tag {
  constructor(tagInfo) {
    super(tagInfo);
    
    const {innerHTML, fileObject} = tagInfo;
    
    this.content = innerHTML;
    const shouldProcess = !this.attributes.hasOwnProperty('src') && this.content.trim().length;
  
    if (shouldProcess) {
      const type = this.attributes['compiler'] ||  'js';
      
     
      if (supportedJSTypes.includes(type)) {
        this.content = jsTransformer(this.content, {fileObject});
      }
    }
  }
  
  async render() {
    const content = await (async () => this.content)();
    return this.composeTagString(content);
  }
}

module.exports.Script = Script;