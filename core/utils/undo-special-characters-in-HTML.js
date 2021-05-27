function undoSpecialCharactersInHTML(html) {
  return html
    .replace(/\sgte\s/g, ' >= ')
    .replace(/\slt\se/g, ' <= ')
    .replace(/\sgt\s/g, ' > ')
    .replace(/\slt\s/g, ' < ');
}

module.exports.undoSpecialCharactersInHTML = undoSpecialCharactersInHTML;