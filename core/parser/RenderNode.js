/**
 * a simple way to collect info of the html to be render
 * that the render function consumes
 */
class RenderNode {
  constructor(htmlString = '', context = {}, file = null) {
    this.htmlString = htmlString;
    this.context = context;
    this.file = file;
  }
}

module.exports.RenderNode = RenderNode;
