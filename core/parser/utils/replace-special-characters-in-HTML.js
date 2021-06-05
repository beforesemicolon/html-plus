const symbolMap = {
  '>=': 'gte',
  '<=': 'lte',
  '>': 'gt',
  '<': 'lt',
}

function replaceSpecialCharactersInHTML(html) {
  return html
    .replace(
      /(?:^|\s)(>=|<=|<|>)(?:\s|$)/g,
      (fullMatch, grabbed) => {
        return fullMatch.replace(grabbed, symbolMap[grabbed])
      });
}

module.exports.replaceSpecialCharactersInHTML = replaceSpecialCharactersInHTML;