const hljs = require('highlight.js');
const {html} = require("../../../core/parser/html");

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
    let content = this.node.innerHTML.trim();
    
    this.content = hljs.highlight(content, {language}).value;
    this.language = language;
  }
  
  render() {
    return html(`
        <pre class="hljs">
            <code class="language-{language">{content}</code>
        </pre>`,
      this);
  }
}

module.exports.CodeSnippet = CodeSnippet;
