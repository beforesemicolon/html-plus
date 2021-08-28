const hljs = require('highlight.js');

class CodeSnippet {
  static get style() {
    return `
      <style>
          pre.hljs {
            padding: 15px;
            display: block;
            overflow: auto;
            font-weight: 200;
            border-radius: 5px;
            text-align: left;
            line-height: 135%;
            tab-size: 2;
          }
      </style>
    `
  }
  
  constructor(node) {
    this.node = node;
    const language = node.getAttribute('language') || 'bash';
    let content = this.node.innerHTML;
    
    this.content = hljs.highlight(content, {language}).value;
    this.language = language;
  }
  
  render() {
    return '<pre class="hljs">' +
      '<code class="language-' + this.language + '">' +
      this.content +
      '</code>' +
      '</pre>';
  }
}

module.exports.CodeSnippet = CodeSnippet;
