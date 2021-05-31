const {Tag} = require('../Tag');

class Inject extends Tag {
  constructor(tagInfo) {
    super(tagInfo);
    
    
    this.content = this.children;
    
    if (tagInfo.rootChildren) {
      const rootChildren = tagInfo.rootChildren();
      
      if (rootChildren.length) {
        const injectId = tagInfo.attributes['id'];
        
        if (injectId) {
          const content = rootChildren.filter(n => {
            return n.attributes && n.attributes['inject'] === injectId;
          });
          
          if (content.length) {
            this.content = content;
          }
        } else {
          this.content = rootChildren.filter(rc => {
            return !rc.attributes || rc.attributes['inject'] === undefined;
          });
        }
      }
    }
  }
  
  async render() {
    return await this.renderChildren(this.content);
  }
}

module.exports.Inject = Inject;