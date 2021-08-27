const hljs = require('highlight.js');
const {html} = require("../../../core/parser/html");

class CodeSnippet {
  constructor(node) {
    this.node = node;
    const language = node.getAttribute('language') || 'bash';
    let content = this.node.innerHTML.trim();
    
    this.content = hljs.highlight(content, {language}).value;
    this.language = language;
  }
  
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
  
  render() {
    return html(`<pre class="hljs"><code class="language-{language}">{content}</code></pre>`, {
      content: this.content,
      language: this.language
    });
  }
}

module.exports.CodeSnippet = CodeSnippet;
