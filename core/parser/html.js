const {RenderNode} = require("./RenderNode");

function html(htmlString, context = {}) {
  return new RenderNode(htmlString, context)
}

module.exports.html = html;
