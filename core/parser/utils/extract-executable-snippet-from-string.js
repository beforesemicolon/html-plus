function extractExecutableSnippetFromString(str) {
  const stack = [];
  const snippets = [];
  const pattern = /\{|\}/g;
  let match;
  let startingCurlyIndex = 0;
  
  while((match = pattern.exec(str)) !== null) {
    const char = match[0];
  
    if(char === '{') {
      stack.push(match.index);
    } else if(char === '}') {
      startingCurlyIndex = stack.pop();
    }
  
    if(stack.length === 0 && char === '}') {
      const matchStr = str.slice(startingCurlyIndex+1, match.index).trim();
      snippets.push({
        match: `{${matchStr}}`,
        executable: matchStr
      });
    }
  }
  
  return snippets;
}

module.exports.extractExecutableSnippetFromString = extractExecutableSnippetFromString;
