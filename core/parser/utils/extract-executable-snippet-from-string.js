/**
 * manually check curly brackets pairs to collect content inside recursively
 * @param str
 * @returns {*[]}
 */
function extractExecutableSnippetFromString(str) {
  const stack = [];
  const pattern = /[}{]/g;
  let snippets = [];
  let match;
  let startingCurlyIndex = null;
  
  while((match = pattern.exec(str)) !== null) {
    const char = match[0];
  
    if(char === '{') {
      stack.push(match.index);
    } else if(char === '}' && stack.length) {
      startingCurlyIndex = stack.pop();
    
      const matchStr = str.slice(startingCurlyIndex+1, match.index);
    
      if (matchStr) {
        for (let j = 0; j < snippets.length; j++) {
          const snippet = snippets[j];
        
          if (snippet.from > startingCurlyIndex && snippet.to < match.index) {
            snippets.splice(j, 1)
          }
        }
      
        snippets.push({
          from: startingCurlyIndex,
          to: match.index,
          match: `{${matchStr}}`,
          executable: matchStr
        });
      }
    }
  }

  return snippets;
}

module.exports.extractExecutableSnippetFromString = extractExecutableSnippetFromString;
