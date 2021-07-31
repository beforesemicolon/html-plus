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
  
  describe('should render blank',  () => {
    it('if no root children', async () => {
      const str = '<inject></inject>';
    
      await expect(transform(str)).resolves.toEqual('');
    });
  });
  
  it('should render all include children if no id provided', async () => {
    const str = '<include partial="inj-partial">stuff: <p>1</p><p>2</p></include>';
  
    await expect(transform(str, {
      partialFiles: [partialFile]
    })).resolves.toEqual('stuff:\n' +
      '<p>1</p><p>2</p>');
  });
  
  it('should render own children if include has no children', async () => {
    partialFile.content = '<inject><p>default content</p></inject>'
    const str = '<include partial="inj-partial"></include>';

    await expect(transform(str, {
      partialFiles: [partialFile]
    })).resolves.toEqual('<p>default content</p>');
  });

  it('should render single include child with same id', async () => {
    partialFile.content = '<inject id="target"></inject>'
    const str = '<include partial="inj-partial"><p>1</p><p inject-id="target">2</p><p>3</p><</include>';

    await expect(transform(str, {
      partialFiles: [partialFile]
    })).resolves.toEqual('<p>2</p>');
  });
  
  describe('should render own children', () => {
    it('if no include children has same id', async () => {
      partialFile.content = '<inject id="target"><p>default</p></inject>'
      const str = '<include partial="inj-partial"><p>1</p><p>2</p><p>3</p><</include>';
    
      await expect(transform(str, {
        partialFiles: [partialFile]
      })).resolves.toEqual('<p>default</p>');
    });
  });
  
  it('should maintain context', async () => {
    partialFile.content = '<inject></inject>'
    const str = '<include partial="inj-partial" data="$data.documents">' +
      '<variable name="currentPath" value="`${$data.documents.currentPath}/sample`"></variable>' +
      '{currentPath}' +
      '</include>';

    await expect(transform(str, {
      partialFiles: [partialFile],
      data: {
        documents: {
          currentPath: '/documentation'
        },
        other: 24
      }
    })).resolves.toEqual('/documentation/sample');
  });
  
  it('should inject html from html attribute and process it', async () => {
    await expect(transform('<inject html="$data.content"></inject>', {
      data: {
        content: '<fragment>Sample</fragment>'
      }
    })).resolves.toEqual('Sample');
  });
});
