const {render} = require('../render');
const {defaultAttributesMap} = require("../default-attributes");
const {customAttributesRegistry} = require("../default-attributes/CustomAttributesRegistry");
const {defaultTagsMap} = require("../default-tags");
const {customTagsRegistry} = require("../default-tags/CustomTagsRegistry");

describe('Fragment Attribute', () => {
  beforeAll(() => {
    for (let key in defaultAttributesMap) {
      customAttributesRegistry.define(key, defaultAttributesMap[key])
    }
    
    for (let key in defaultTagsMap) {
      customTagsRegistry.define(key, defaultTagsMap[key])
    }
  })
  
  it('should render children content only', () => {
    const str = '<div #fragment><b>child text</b></div>'
    
    expect(render(str)).toEqual('<b>child text</b>');
  });
  
  it('should render empty if no children', () => {
    const str = '<div #fragment></div>'
    
    expect(render(str)).toEqual('');
  });
  
  describe('should work with other attributes', () => {
    it('repeat', () => {
      expect(render('<b #fragment #repeat="3">{$item}</b>')).toEqual('123');
    });
    
    it('attr', () => {
      expect(render('<b #attr="class, cls, true" #fragment>item</b>')).toEqual('item');
    });
    
    it('if', () => {
      expect(render('<b #if="true" #fragment>item</b>')).toEqual('item');
    });
    
    it('ignore', () => {
      expect(() => render('<b #ignore #fragment>{item}</b>')).toThrowError('item is not defined');
    });
  });
});
