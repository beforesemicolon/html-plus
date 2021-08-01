const {PartialFile} = require("../PartialFile");
const {transform} = require('./../transform');
const cp = require('child_process');
const path = require('path');
const {promisify} = require('util');

const exec = promisify(cp.exec);

describe('Include Tag', () => {
  const nestedPartialAbsPath = `${path.resolve(__dirname)}/_inc-nested-partial.html`;
  const partialAbsPath = `${path.resolve(__dirname)}/_inc-partial.html`;
  let partialFile;
  let nestedPartialFile;
  
  beforeAll(async () => {
    await exec(`echo '<div>{title}</div>' >> ${partialAbsPath}`);
    await exec(`echo '<div>Nested: {title}</div>' >> ${nestedPartialAbsPath}`);
    partialFile = new PartialFile(partialAbsPath, __dirname);
    nestedPartialFile = new PartialFile(nestedPartialAbsPath, __dirname);
  })
  
  afterAll(async () => {
    await exec(`rm ${partialAbsPath}`);
    await exec(`rm ${nestedPartialAbsPath}`);
  });
  
  it('should include partial with partial attribute', async () => {
    const str = '<include partial="inc-partial" data="{title: \'include partial\'}"></include>'

    await expect(transform(str, {
      partialFiles: [partialFile]
    })).resolves.toEqual('<div>include partial</div>');
  });

  it('should include partial with partialPath attribute', async () => {
    const str = '<include partial-path="_inc-partial.html" data="{title: \'include partial\'}"></include>'

    await expect(transform(str, {
      partialFiles: [partialFile],
      file: {fileDirectoryPath: __dirname}
    })).resolves.toEqual('<div>include partial</div>');
  });
  
  it('should allow for nested includes', async () => {
    partialFile.content = '<include partial-path="_inc-nested-partial.html"></include>'
    const str = '<include partial-path="_inc-partial.html" data="{title: \'include partial\'}"></include>'
    
    await expect(transform(str, {
      partialFiles: [partialFile, nestedPartialFile],
      file: {fileDirectoryPath: __dirname}
    })).resolves.toEqual('<div>Nested: include partial</div>');
  });

  it('should render blank if no partial info is provided', async () => {
    const str = '<include></include>'

    await expect(transform(str)).resolves.toEqual('');
  });

  it('should fail if non object literal data attribute value is provided', async () => {
    const str = '<include data="sample"></include>'
    
    await expect(transform(str))
      .rejects.toThrowError('Failed to process attribute "data": sample is not defined');
  });
});
