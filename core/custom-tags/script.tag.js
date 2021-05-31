const {Tag} = require('../Tag');
const {jsTransformer} = require('../transformers/js.transformer');

const supportedJSTypes = ['js', 'ts'];

class Script extends Tag {
  constructor(tagInfo) {
    super(tagInfo);
    
    const {innerHTML, env, fileObject, data = {}, context = ''} = tagInfo;
    
    this.content = innerHTML;
    const shouldProcess = !this.attributes.hasOwnProperty('src') && this.content.trim().length;
  
    if (shouldProcess) {
      const type = this.attributes['compiler'] ||  'js';
      
      if (supportedJSTypes.includes(type)) {
        this.content = jsTransformer(this.content, {
          loader: type,
          env
        });
      }
    }
  }
  
  static customAttributes = {
    compiler: {bind: false}
  }
  
  async render() {
    const content = await (async () => this.content)();
    return this.composeTagString(content, Script.customAttributes);
  }
}

module.exports.Script = Script;