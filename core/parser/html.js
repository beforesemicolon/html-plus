class Render {
  constructor(htmlString, context) {
    this.htmlString = htmlString;
    this.context = context;
  }
}

function html(htmlString, context = {}) {
  return new Render(htmlString, context)
}

module.exports.html = html;
