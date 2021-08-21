const {render} = require('../render');
const {defaultAttributesMap} = require("../default-attributes");
const {customAttributesRegistry} = require("../default-attributes/CustomAttributesRegistry");
const {defaultTagsMap} = require("../default-tags");
const {customTagsRegistry} = require("../default-tags/CustomTagsRegistry");

describe('If Attribute', () => {
  beforeAll(() => {
    for (let key in defaultAttributesMap) {
      customAttributesRegistry.define(key, defaultAttributesMap[key])
    }
    
    for (let key in defaultTagsMap) {
      customTagsRegistry.define(key, defaultTagsMap[key])
    }
  })
  
  it('should only process if attribute is preceded by #', () => {
    expect(render('<b if="false"></b>')).toEqual('<b if="false"></b>')
    expect(render('<b #if="false"></b>')).toEqual('')
  });
  
  it('should render node if condition is TRUTHY', () => {
    expect(render('<b #if="true"></b>')).toEqual('<b></b>');
    expect(render('<b #if="5"></b>')).toEqual('<b></b>');
    expect(render('<b #if="4 > 0"></b>')).toEqual('<b></b>');
    expect(render({
      content: '<b #if="checked"></b>',
      context: {checked: true}
    })).toEqual('<b></b>');
    expect(render({
      content: '<b #if="!checked"></b>',
      context: {checked: false}
    })).toEqual('<b></b>');
    expect(render({
      content: '<b #if="checked === false"></b>',
      context: {checked: false}
    })).toEqual('<b></b>');
  });
  
  it('should NOT render node if condition is FALSY', () => {
    expect(render('<b #if="false"></b>')).toEqual('');
    expect(render('<b #if="0"></b>')).toEqual('');
    expect(render('<b #if="null"></b>')).toEqual('');
    expect(render('<b #if="undefined"></b>')).toEqual('');
    expect(render('<b #if=""></b>')).toEqual('');
    expect(render('<b #if="4 < 0"></b>')).toEqual('');
    expect(render({
      content: '<b #if="checked"></b>',
      context: {checked: false}
    })).toEqual('');
    expect(render({
      content: '<b #if="!checked"></b>',
      context: {checked: true}
    })).toEqual('');
    expect(render({
      content: '<b #if="checked === false"></b>',
      context: {checked: true}
    })).toEqual('');
  });
  
  describe('should work with other attributes', () => {
    it('repeat', () => {
      expect(render('<b #if="false" #repeat="3">{$item}</b>')).toEqual('');
      expect(render('<b #if="true" #repeat="3">{$item}</b>')).toEqual('<b>1</b><b>2</b><b>3</b>');
    });
    
    it('attr', () => {
      expect(render('<b #if="false" #attr="id, imp, true">item</b>')).toEqual('');
      expect(render('<b #if="true" #attr="id, imp, true">item</b>')).toEqual('<b id="imp">item</b>');
    });
    
    it('fragment', () => {
      expect(render('<b #if="false" #fragment>item</b>')).toEqual('');
      expect(render('<b #if="true" #fragment>item</b>')).toEqual('item');
    });
    
    it('ignore', () => {
      expect(render('<b #if="false" #ignore>{item}</b>')).toEqual('');
      expect(render('<b #if="true" #ignore>{item}</b>')).toEqual('<b>{item}</b>');
    });
  });
});
