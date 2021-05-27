const {executeCode} = require("../../../utils/execute-code");
const {extractExecutableSnippetFromString} = require("../../../utils/extract-executable-snippet-from-string");
const {undoSpecialCharactersInHTML} = require("./undo-special-characters-in-HTML");

function bindData(str, data) {
  str = str.replace(/\s+$/g, '\n');
  
  if (str.trim() && str.includes('{')) {
    str = undoSpecialCharactersInHTML(str);
    const execs = extractExecutableSnippetFromString(str);
    
    if (execs.length) {
      for (let m of execs) {
        const res = executeCode(m.executable, data);
        str = str.replace(m.match, res);
      }
    }
  }
  
  return str;
}

module.exports.bindData = bindData;