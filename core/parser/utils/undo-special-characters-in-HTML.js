const attributePattern = /\"([^"]*)\"/g;

function undoSpecialCharactersInHTML(html) {
  return html
    .replace(attributePattern,
      (match) => {
        return match
          .replace(new RegExp('&lt;', 'gm'), '<')
          .replace(new RegExp('&gt;', 'gm'), '>');
      });
}

module.exports.undoSpecialCharactersInHTML = undoSpecialCharactersInHTML;