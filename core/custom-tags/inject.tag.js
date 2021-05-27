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
          const extendingNode = rootChildren.find(n => n.attributes && n.attributes['inject'] === injectId);
    
          if (extendingNode) {
            this.content = [extendingNode];
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