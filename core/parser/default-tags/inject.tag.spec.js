const {render} = require('../render');
const path = require('path');
const {writeFile, unlink} = require('fs/promises');
const {PartialFile} = require("../PartialFile");
const {defaultAttributesMap} = require("../default-attributes");
const {customAttributesRegistry} = require("../default-attributes/CustomAttributesRegistry");
const {defaultTagsMap} = require("../default-tags");
const {customTagsRegistry} = require("../default-tags/CustomTagsRegistry");

describe('Inject Tag', () => {
  const partialAbsPath = `${path.resolve(__dirname)}/_inj-partial.html`;
  let partialFile;
  
  beforeAll(async () => {
    await writeFile(partialAbsPath, '<inject></inject>', 'utf-8')
    partialFile = new PartialFile(partialAbsPath, __dirname);
  
    for (let key in defaultAttributesMap) {
      customAttributesRegistry.define(key, defaultAttributesMap[key])
    }
  
    for (let key in defaultTagsMap) {
      customTagsRegistry.define(key, defaultTagsMap[key])
    }
  })
  
  afterAll(async () => {
    await unlink(partialAbsPath)
  });
  
  describe('should render blank',  () => {
    it('if no root children', () => {
      expect(render('<inject></inject>')).toEqual('');
    });
  });
  
  it('should render all include children if no id provided', () => {
    expect(render({
      content: '<include partial="inj-partial">stuff: <p>1</p><p>2</p></include>',
      partialFiles: [partialFile]
    })).toEqual('stuff: <p>1</p><p>2</p>');
  });
  
  it('should render own children if include has no children', () => {
    partialFile.content = '<inject><p>default content</p></inject>'

    expect(render({
      content: '<include partial="inj-partial"></include>',
      partialFiles: [partialFile]
    })).toEqual('<p>default content</p>');
  });

  it('should render single include child with same id', () => {
    partialFile.content = '<inject id="target"></inject>'

    expect(render({
      content: '<include partial="inj-partial"><p>1</p><p inject-id="target">2</p><p>3</p><</include>',
      partialFiles: [partialFile]
    })).toEqual('<p>2</p>');
  });
  
  describe('should render own children', () => {
    it('if no include children has same id', () => {
      partialFile.content = '<inject id="target"><p>default</p></inject>'
    
      expect(render({
        content: '<include partial="inj-partial"><p>1</p><p>2</p><p>3</p><</include>',
        partialFiles: [partialFile]
      })).toEqual('<p>default</p>');
    });
  });
  
  it('should maintain context', () => {
    partialFile.content = '<inject></inject>'
    const str = '<include partial="inj-partial" data="documents">' +
      '<variable name="currentPath" value="`${documents.currentPath}/sample`"></variable>' +
      '{currentPath}' +
      '</include>';

    expect(render({
      content: str,
      partialFiles: [partialFile],
      context: {
        documents: {
          currentPath: '/documentation'
        },
        other: 24
      }
    })).toEqual('/documentation/sample');
  });
  
  it('should inject html from html attribute and process it', () => {
    expect(render({
      content: '<inject html="content"></inject>',
      context: {
        content: '<fragment>Sample</fragment>'
      }
    })).toEqual('Sample');
  });
});
