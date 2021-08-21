const {render} = require('../render');
const {defaultAttributesMap} = require("../default-attributes");
const {customAttributesRegistry} = require("../default-attributes/CustomAttributesRegistry");
const {defaultTagsMap} = require("../default-tags");
const {customTagsRegistry} = require("../default-tags/CustomTagsRegistry");

describe('Ignore Attribute', () => {
  beforeAll(() => {
    for (let key in defaultAttributesMap) {
      customAttributesRegistry.define(key, defaultAttributesMap[key])
    }
    
    for (let key in defaultTagsMap) {
      customTagsRegistry.define(key, defaultTagsMap[key])
    }
  })
  
  describe('should not bind data', () => {
    it('when no value', () => {
      const str = '<div #ignore><b>{sample}</b></div>'
  
      expect(render(str)).toEqual('<div><b>{sample}</b></div>');
    });
  
    it('with value', () => {
      expect(render({
        content: '<div #ignore="content"><b>{sample}</b></div>',
        context: {
          content: '<p>Sample</p>'
        }
      })).toEqual('<div><b>{sample}</b><p>Sample</p></div>');
    });
  });
  
  it('should escape html', () => {
    
    expect(render({
      content: '<div #ignore escape><b>{sample}</b></div>',
      context: {
        content: '<p>Sample</p>'
      }
    })).toEqual('<div>&lt;b&gt;{sample}&lt;/b&gt;</div>');
  });
  
  describe('should work with other attributes', () => {
    it('repeat', () => {
      expect(render('<b #ignore #repeat="3">{$item}</b>'))
        .toEqual('<b>{$item}</b><b>{$item}</b><b>{$item}</b>');
    });
  
    it('fragment', () => {
      expect(() => render('<b #ignore #fragment>{item}</b>')).toThrowError('item is not defined');
    });
  
    it('if', () => {
      expect(render('<b #if="false" #ignore>{item}</b>')).toEqual('');
      expect(render('<b #if="true" #ignore>{item}</b>')).toEqual('<b>{item}</b>');
    });
    
    it('attr', () => {
      expect(render('<b #attr="class, cls, true" #ignore>{item}</b>'))
        .toEqual('<b class="cls">{item}</b>');
    });
  });
});
