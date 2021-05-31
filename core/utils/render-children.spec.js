const {HTMLNode} = require("../HTMLNode");
const {TextNode} = require("../TextNode");
const {renderChildren} = require('./render-children');

describe('renderChildren', () => {
  it('should return empty string if not children', () => {
    return expect(renderChildren()).resolves.toEqual('')
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
      new TextNode('my sample'),
      new TextNode('text'),
      new TextNode('children'),
    ])).resolves.toEqual('my sample' +
      'text' +
      'children')
  });
  
  it('should handle html nodes as children', () => {
    return expect(renderChildren([
      new HTMLNode({rawTagName: 'p', childNodes: [{rawText: 'my simple paragraph'}]}),
      new HTMLNode({rawTagName: 'h2', childNodes: [{rawText: 'title'}]}),
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