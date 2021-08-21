const {render} = require('../render');
const {defaultAttributesMap} = require("../default-attributes");
const {customAttributesRegistry} = require("../default-attributes/CustomAttributesRegistry");
const {defaultTagsMap} = require("../default-tags");
const {customTagsRegistry} = require("../default-tags/CustomTagsRegistry");

describe('Ignore Tag', () => {
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
      const str = '<ignore><b>{sample}</b></div>'
      
      expect(render(str)).toEqual('<b>{sample}</b>');
    });
    
    it('with value', () => {
      expect(render({
        content: '<ignore value="content"><b>{sample}</b></ignore>',
        context: {
          content: '<p>Sample</p>'
        }
      })).toEqual('<b>{sample}</b><p>Sample</p>');
    });
  });
  
  it('should escape html', () => {
    expect(render({
      content: '<ignore escape><b>{sample}</b></div>',
      context: {
        content: '<p>Sample</p>'
      }
    })).toEqual('&lt;b&gt;{sample}&lt;/b&gt;');
  });
});
