const {defaultAttributesMap} = require("../default-attributes");
const {HTMLNode} = require("./HTMLNode");
const {renderByAttribute} = require('./render-by-attribute');

describe('render-by-attribute', () => {
  it('should return node if not special attr', () => {
    const node = (new HTMLNode('<p>paragraph</p>')).childNodes()[0];
    
    expect(renderByAttribute(node, {
      customAttributes: defaultAttributesMap,
      data: {}
    })).toEqual(node)
  });
  
  it('should string if attribute match', () => {
    const node = (new HTMLNode('<p #repeat="2">{$item}</p>')).childNodes()[0];
  
    expect(renderByAttribute(node, {
      customAttributes: defaultAttributesMap,
      data: {}
    })).toEqual('<p>1</p><p>2</p>')
  });
});