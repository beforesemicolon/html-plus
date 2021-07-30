const hljs = require('highlight.js');

class CodeSnippet {
  preStyle = `
    padding: 15px;
    display: block;
    overflow: auto;
    font-weight: 200;
    border-radius: 5px;
    text-align: left;
    line-height: 135%;
    tab-size: 2;
  `.replace(/\s{2}/g, '');
  
  constructor(node) {
    this.node = node;
    const {language = 'bash'} = node.attributes;
    let content = this.node.innerHTML.trim();
    
    this.content = hljs.highlight(content, {language}).value;
    this.language = language;
  }
  
  render() {
    return '<pre class="hljs" style="' + this.preStyle + '">' +
      '<code class="language-' + this.language + '">' +
      this.content +
      '</code>' +
      '</pre>';
  }
}

module.exports.CodeSnippet = CodeSnippet;
