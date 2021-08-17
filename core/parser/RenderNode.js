class RenderNode {
  constructor(htmlString = '', context = {}, file = null) {
    this.htmlString = htmlString;
    this.context = context;
    this.file = file;
  }
}

module.exports.RenderNode = RenderNode;
