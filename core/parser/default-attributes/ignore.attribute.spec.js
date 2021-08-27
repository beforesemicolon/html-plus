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
  
  it('should ignore', () => {
    const str = '<div #ignore><b>{sample}</b></div>'
  
    expect(render(str)).toEqual('<div><b>{sample}</b></div>');
  });
  
  it('should ignore like adding ', () => {
    expect(render({
      content: '<div><b>{sample}</b>{content}</div>',
      context: {
        x: 'test',
        sample: 'super',
        content: '<p>{x}</p>'
      }
    })).toEqual('<div><b>super</b><p>{x}</p></div>');
    
    expect(render({
      content: '<div #ignore="content"><b>{sample}</b></div>',
      context: {
        x: 'test',
        content: '<p>{x}</p>'
      }
    })).toEqual('<div><b>{sample}</b><p>{x}</p></div>');
  });
  
  it('should escape html', () => {
    
    expect(render({
      content: '<div #ignore="content" escape><b>{sample}</b></div>',
      context: {
        content: '<p>Sample</p>'
      }
    })).toEqual('<div>&lt;b&gt;{sample}&lt;/b&gt;&lt;p&gt;Sample&lt;/p&gt;</div>');
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
