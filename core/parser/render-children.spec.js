const {HTMLNode} = require("./HTMLNode");
const {renderChildren} = require('./render-children');

describe('renderChildren', () => {
  it('should return empty string if not children', () => {
    expect(renderChildren()).toEqual('')
  });
  
  it('should return text separated by new lines', () => {
    expect(renderChildren([
      'my sample',
      'text',
      'children',
    ])).toEqual('my sample' +
      'text' +
      'children')
  });
  
  it('should handle text nodes as children', () => {
    expect(renderChildren([
      'my sample',
      'text',
      'children',
    ])).toEqual('my sample' +
      'text' +
      'children')
  });
  
  it('should handle html nodes as children', () => {
    expect(renderChildren([
      new HTMLNode('<p>my simple paragraph</p>'),
      new HTMLNode('<h2>title</h2>'),
      new HTMLNode('<div></div>'),
    ])).toEqual('<p>my simple paragraph</p>' +
      '<h2>title</h2>' +
      '<div></div>')
  });
  
  it('should handle any object with toString', () => {
    expect(renderChildren([
      {toString() { return 'simple text'}},
      {toString() { return 'another text'}},
    ])).toEqual('simple text' +
      'another text')
  });
});