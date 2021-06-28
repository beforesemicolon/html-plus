const attributePattern = /\"([^"]*)\"/g;

function replaceSpecialCharactersInHTML(html) {
  return html
    .replace(attributePattern,
      (match) => {
        return match
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
      });
}

module.exports.replaceSpecialCharactersInHTML = replaceSpecialCharactersInHTML;