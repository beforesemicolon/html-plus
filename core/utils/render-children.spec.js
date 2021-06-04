const {TextNode} = require("node-html-parser");
const {HTMLNode} = require("../HTMLNode");
const {renderChildren} = require('./render-children');

describe('renderChildren', () => {
  it('should return empty string if not children', () => {
    return expect(renderChildren()).toEqual('')
  });
  
  it('should return text separated by new lines', () => {
    return expect(renderChildren([
      'my sample',
      'text',
      'children',
    ])).resolves.toEqual('my sample' +
      'text' +
      'children')
  });
  
  it('should handle text nodes as children', () => {
    return expect(renderChildren([
      'my sample',
      'text',
      'children',
    ])).resolves.toEqual('my sample' +
      'text' +
      'children')
  });
  
  it('should handle html nodes as children', () => {
    return expect(renderChildren([
      new HTMLNode({rawTagName: 'p', childNodes: [new TextNode('my simple paragraph')]}),
      new HTMLNode({rawTagName: 'h2', childNodes: [new TextNode('title')]}),
      new HTMLNode({rawTagName: 'div', childNodes: []}),
    ])).resolves.toEqual('<p>my simple paragraph</p>' +
      '<h2>title</h2>' +
      '<div></div>')
  });
  
  it('should handle any object with toString', () => {
    return expect(renderChildren([
      {toString() { return 'simple text'}},
      {toString() { return 'another text'}},
    ])).resolves.toEqual('simple text' +
      'another text')
  });
});