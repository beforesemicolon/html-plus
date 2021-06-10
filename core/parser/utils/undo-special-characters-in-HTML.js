const attributePattern = /\"([^"]*)\"/g;

function undoSpecialCharactersInHTML(html) {
  return html
    .replace(attributePattern,
      (match) => {
        return match
          .replace('&lt;', '<')
          .replace('&gt;', '>');
      });
}

module.exports.undoSpecialCharactersInHTML = undoSpecialCharactersInHTML;