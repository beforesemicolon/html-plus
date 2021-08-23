const {executeCode} = require("./execute-code");
const {extractExecutableSnippetFromString} = require("./extract-executable-snippet-from-string");

function bindData(str, data = {}) {
  if (typeof str === 'string' && str.trim() && str.includes('{')) {
    const execs = extractExecutableSnippetFromString(str.trim());

    if (execs.length) {
      for (let m of execs) {
        // try {
          const res = executeCode(`(() => (${m.executable}))()`, data);
          str = str.replace(m.match, res);
        // } catch(e) {
        //
        // }
      }
    }
  }
  
  return str;
}

module.exports.bindData = bindData;
