const {render} = require('../render');
const {defaultAttributesMap} = require("../default-attributes");
const {customAttributesRegistry} = require("../default-attributes/CustomAttributesRegistry");
const {defaultTagsMap} = require("../default-tags");
const {customTagsRegistry} = require("../default-tags/CustomTagsRegistry");

describe('Fragment Tag', () => {
  beforeAll(() => {
    for (let key in defaultAttributesMap) {
      customAttributesRegistry.define(key, defaultAttributesMap[key])
    }
    
    for (let key in defaultTagsMap) {
      customTagsRegistry.define(key, defaultTagsMap[key])
    }
  })
  
  it('should render children content only', () => {
    const str = '<fragment><b>child text</b></fragment>'
    
    expect(render(str)).toEqual('<b>child text</b>');
  });
  
  it('should render empty if no children', () => {
    const str = '<fragment></fragment>'
    
    expect(render(str)).toEqual('');
  });
});
