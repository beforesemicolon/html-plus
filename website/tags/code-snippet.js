const commandsPattern = /npm|node|npx|cd|mkdir|touch|ls/gm;
const varsPattern = /\s(var|let|const)\s/gm;
const importPattern = /require|import|export|module\.exports/gm;
const jsKeywordsPattern = /\s(function|class|switch|if|while|for|break|continue\.exports|__dirname|__filename)\s/gm;
const objPattern = /Array|Object|Map|Set|Symbol\.exports/gm;
const propertyPattern = /\.[\w\-_]+/gm;
const commentPattern = /#.+/gm

class CodeSnippet {
  style = `
    overflow: scroll;
    background: #212f36;
    border-radius: 5px;
    color: #fff;
    padding: 20px 25px;
    line-height: 130%;
    font-size: 0.9rem;
    font-weight: 200;
    margin-bottom: 35px;
    text-align: left;
    white-space: pre-line;
    tab-width: 4;
  `.replace(/\s{2}/g, '');
  
  constructor(node) {
    this.node = node;
    const {type} = node.attributes;
    let content = this.node.innerHTML.trim();
    
    switch (type) {
      case 'js':
        content = content
          .replace(varsPattern, (m) => `<span style="color: #f072ff">${m}</span>`)
          .replace(importPattern, (m) => `<span style="color: #11d0ad">${m}</span>`)
          .replace(propertyPattern, (m) => `<span style="color: #ffc107">${m}</span>`)
          .replace(jsKeywordsPattern, (m) => `<span style="color: #2eefdf">${m}</span>`)
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
        break;
      case 'html':
        content = content
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
        break;
      case 'terminal':
      case 'bash':
        content = content
          .replace(commandsPattern, (m) => `<span style="color: #2fe99e">${m}</span>`);
        break;
      default:
    }
    
    this.content = content
      .replace(/@beforesemicolon\/html-plus/g, (m) => `<span style="color: #feffa2">${m}</span>`)
      .replace(/express/g, (m) => `<span style="color: #feffa2">${m}</span>`)
      .replace(/engine/g, (m) => `<span style="color: #feffa2">${m}</span>`)
  }
  
  render() {
    return `<pre style="${this.style}"><code>${this.content}</code></pre>`;
  }
}

module.exports.CodeSnippet = CodeSnippet;
