const {render} = require('../render');
const {defaultAttributesMap} = require("../default-attributes");
const {customAttributesRegistry} = require("../default-attributes/CustomAttributesRegistry");
const {defaultTagsMap} = require("../default-tags");
const {customTagsRegistry} = require("../default-tags/CustomTagsRegistry");

describe('Log Tag', () => {
  let logSpy = null;
  
  beforeAll(() => {
    for (let key in defaultAttributesMap) {
      customAttributesRegistry.define(key, defaultAttributesMap[key])
    }
    
    for (let key in defaultTagsMap) {
      customTagsRegistry.define(key, defaultTagsMap[key])
    }
  })
  
  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => null);
  })
  
  afterAll(() => {
    logSpy.mockRestore();
  })
  
  it('should log null if no value specified', () => {
    const str = '<variable name="sample" value="{x: 10}"></variable><log></log>'
    
    expect(render(str)).toEqual('<pre style="overflow: scroll">null</pre>');
    expect(logSpy).toHaveBeenCalled()
  });
  
  it('should log specified value', () => {
    const str = '<variable name="sample" value="{x: 10}"></variable><log value="sample"></log>'
  
    expect(render(str)).toEqual('<pre style="overflow: scroll">{\n' +
      '  "value": {\n' +
      '    "x": 10\n' +
      '  }\n' +
      '}</pre>');
    expect(logSpy).toHaveBeenCalled()
  });
  
  it('should add label to log', () => {
    const str = '<variable name="sample" value="{x: 10}"></variable><log value="sample">my sample</log>'
  
    expect(render(str)).toEqual('<p>my sample</p><pre style="overflow: scroll">{\n' +
      '  "value": {\n' +
      '    "x": 10\n' +
      '  }\n' +
      '}</pre>');
    expect(logSpy).toHaveBeenCalled()
  });
});
