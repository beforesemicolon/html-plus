const {composeTagString} = require("../utils/compose-tag-string");
const {jsTransformer} = require('../transformers/js.transformer');

const supportedJSTypes = ['js', 'ts'];

class Script {
  constructor(node, options) {
    
    const {env} = options;
    const {innerHTML, attributes} = node;
  
    this.node = node;
    this.content = innerHTML;
    const shouldProcess = !attributes.hasOwnProperty('src') && this.content.trim().length;
  
    if (shouldProcess) {
      const type = attributes['compiler'] ||  'js';
      
      if (supportedJSTypes.includes(type)) {
        this.content = jsTransformer(this.content, {
          loader: type,
          env
        });
      }
    }
  }
  
  static customAttributes = {
    compiler: null
  }
  
  async render() {
    const content = await (async () => this.content)();
    return composeTagString(this.node, content, Object.keys(Script.customAttributes));
  }
}

module.exports.Script = Script;