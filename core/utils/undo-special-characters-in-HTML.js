const symbolMap = {
  gte: '>=',
  lte: '<=',
  gt: '>',
  lt: '<',
}

function undoSpecialCharactersInHTML(html) {
  return html
    .replace(
      /(?:^|\s)(gte|lte|gt|lt)(?:\s|$)/g,
      (fullMatch, grabbed) => {
        return fullMatch.replace(grabbed, symbolMap[grabbed])
      })
}

module.exports.undoSpecialCharactersInHTML = undoSpecialCharactersInHTML;