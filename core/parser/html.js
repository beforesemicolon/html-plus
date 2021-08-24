const {RenderNode} = require("./RenderNode");

function html(htmlString, context = {}) {
  return new RenderNode(htmlString.trim(), context)
}

module.exports.html = html;
