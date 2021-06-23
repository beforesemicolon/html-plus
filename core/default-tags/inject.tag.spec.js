const {transform} = require('./../transform');
const cp = require('child_process');
const path = require('path');
const {PartialFile} = require("../PartialFile");
const {promisify} = require('util');

const exec = promisify(cp.exec);

describe('Inject Tag', () => {
  const partialAbsPath = `${path.resolve(__dirname)}/_inj-partial.html`;
  let partialFile;
  
  beforeAll(async () => {
    await exec(`echo '<inject></inject>' >> ${partialAbsPath}`);
    partialFile = new PartialFile(partialAbsPath, __dirname);
  })
  
  afterAll(async () => {
    await exec(`rm ${partialAbsPath}`);
  });
  
  describe('should render blank', () => {
    it('if no root children', () => {
      const str = '<inject></inject>';
    
      expect(transform(str)).toEqual('');
    });
  });
  
  it('should render all include children if no id provided', () => {
    const str = '<include partial="inj-partial">stuff: <p>1</p><p>2</p></include>';
  
    expect(transform(str, {
      partialFileObjects: [partialFile]
    })).toEqual('stuff:\n' +
      '<p>1</p><p>2</p>');
  });
  
  it('should render own children if include has no children', () => {
    partialFile.content = '<inject><p>default content</p></inject>'
    const str = '<include partial="inj-partial"></include>';

    expect(transform(str, {
      partialFileObjects: [partialFile]
    })).toEqual('<p>default content</p>');
  });

  it('should render single include child with same id', () => {
    partialFile.content = '<inject id="target"></inject>'
    const str = '<include partial="inj-partial"><p>1</p><p inject-id="target">2</p><p>3</p><</include>';

    expect(transform(str, {
      partialFileObjects: [partialFile]
    })).toEqual('<p>2</p>');
  });
  
  describe('should render own children', () => {
    it('if no include children has same id', () => {
      partialFile.content = '<inject id="target"><p>default</p></inject>'
      const str = '<include partial="inj-partial"><p>1</p><p>2</p><p>3</p><</include>';
    
      expect(transform(str, {
        partialFileObjects: [partialFile]
      })).toEqual('<p>default</p>');
    });
  });
  
  it('should maintain context', () => {
    partialFile.content = '<inject></inject>'
    const str = '<include partial="inj-partial" data="$data.documents">' +
      '<variable name="currentPath" value="`${$data.documents.currentPath}/sample`"></variable>' +
      '{currentPath}' +
      '</include>';

    expect(transform(str, {
      partialFileObjects: [partialFile],
      data: {
        documents: {
          currentPath: '/documentation'
        },
        other: 24
      }
    })).toEqual('/documentation/sample');
  });
  
  it('should inject html from html attribute and process it', () => {
    expect(transform('<inject html="$data.content"></inject>', {
      data: {
        content: '<fragment>Sample</fragment>'
      }
    })).toEqual('Sample');
  });
});