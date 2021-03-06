const {PartialFile} = require("../PartialFile");
const {File} = require("../File");
const {render} = require('../render');
const path = require('path');
const {writeFile, unlink} = require('../../utils/fs-promise');
const {defaultAttributesMap} = require("../default-attributes");
const {customAttributesRegistry} = require("../default-attributes/CustomAttributesRegistry");
const {defaultTagsMap} = require("../default-tags");
const {customTagsRegistry} = require("../default-tags/CustomTagsRegistry");

describe('Include Tag', () => {
  const file = new File(path.resolve(__dirname, __filename), __dirname)
  const nestedPartialAbsPath = `${path.resolve(__dirname)}/_inc-nested-partial.html`;
  const partialAbsPath = `${path.resolve(__dirname)}/_inc-partial.html`;
  let partialFile;
  let nestedPartialFile;
  
  beforeAll(async () => {
    await writeFile(partialAbsPath, '<div>{title}</div>', 'utf-8');
    await writeFile(nestedPartialAbsPath, '<div>Nested: {title}</div>', 'utf-8');
    
    for (let key in defaultAttributesMap) {
      customAttributesRegistry.define(key, defaultAttributesMap[key])
    }
  
    for (let key in defaultTagsMap) {
      customTagsRegistry.define(key, defaultTagsMap[key])
    }
  })
  
  beforeEach(() => {
    partialFile = new PartialFile(partialAbsPath, __dirname);
    nestedPartialFile = new PartialFile(nestedPartialAbsPath, __dirname);
  })
  
  afterAll(async () => {
    await unlink(partialAbsPath);
    await unlink(nestedPartialAbsPath);
  });
  
  it('should include partial with partial attribute', () => {
    const str = '<include partial="inc-partial" data="{title: \'include partial\'}"></include>'

    expect(render( {
      content: str,
      partialFiles: [partialFile]
    })).toEqual('<div>include partial</div>');
  });

  it('should include partial with partialPath attribute', () => {
    const str = '<include partial-path="_inc-partial.html" data="{title: \'include partial\'}"></include>'

    expect(render( {
      content: str,
      partialFiles: [partialFile],
      file: {fileDirectoryPath: __dirname}
    })).toEqual('<div>include partial</div>');
  });
  
  it('should allow for nested includes', () => {
    partialFile.content = '<include partial-path="_inc-nested-partial.html"></include>'
    const str = '<include partial-path="_inc-partial.html" data="{title: \'include partial\'}"></include>'
    
    expect(render( {
      content: str,
      partialFiles: [partialFile, nestedPartialFile],
      file: {fileDirectoryPath: __dirname}
    })).toEqual('<div>Nested: include partial</div>');
  });
  
  it('should allow parent context through', () => {
    const str = '<variable name="title" value="`my title`"></variable><include partial="inc-partial"></include>'
  
    expect(render( {
      content: str,
      file,
      nodeFile: file,
      partialFiles: [partialFile]
    })).toEqual('<div>my title</div>');
  });
  
  it('should render blank if no partial info is provided', () => {
    const str = '<include></include>'

    expect(render(str)).toEqual('');
  });

  it('should fail if non object literal data attribute value is provided', () => {
    const str = '<include data="sample"></include>'
    
    expect(() => render(str))
      .toThrowError('sample is not defined');
  });
});
