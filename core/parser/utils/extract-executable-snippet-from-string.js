function extractExecutableSnippetFromString(str) {
  str = str.replace(/\s{2}/g, '').trim();
  
  const stack = [];
  const snippets = [];
  let startingCurlyIndex = 0;
  
  if(startingCurlyIndex >= 0) {
    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      
      if(char === '{') {
        stack.push(i);
      } else if(char === '}') {
        startingCurlyIndex = stack.pop();
      }
      
      if(stack.length === 0 && char === '}') {
        const match = str.slice(startingCurlyIndex, i+1).trim();
        snippets.push({
          match,
          executable: match.slice(1, match.length - 1).trim()
        });
      }
    }
  }
  
  return snippets;
}

module.exports.extractExecutableSnippetFromString = extractExecutableSnippetFromString;