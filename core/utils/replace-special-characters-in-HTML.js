function replaceSpecialCharactersInHTML(html) {
  const change = s => s
    .replace(/\s>=\s/g, ' gte ')
    .replace(/\s<=\s/g, ' lte ')
    .replace(/\s>\s/g, ' gt ')
    .replace(/\s<\s/g, ' lt ');
  
  return html
    .replace(/(?<=#if="|#repeat=")[^"]+/gm, change)
    .replace(/(?<={)[^}]+/gm, change)
}

module.exports.replaceSpecialCharactersInHTML = replaceSpecialCharactersInHTML;