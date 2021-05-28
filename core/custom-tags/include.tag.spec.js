const {Include} = require('./include.tag');
const {transform} = require('./../transform');

describe('Include', () => {
  const partialFile = {
    name: '_sample',
    fileAbsolutePath: '/_sample.html',
    content: '<div>{title}</div>'
  };
  
  it('should include partial with partial attribute', async () => {
    const str = '<include partial="sample" data="{title: \'include partial\'}"></include>'
    const inc = new Include({
      attributes: {
        partial: '_sample',
        data: {title: 'include partial'}
      },
      partialFiles: [{...partialFile, render: async ({title}) => `<div>${title}</div>`}]
    });
  
    await expect(inc.render()).resolves.toEqual('<div>include partial</div>');
    await expect(transform(str, {
      partialFileObjects: [partialFile]
    })).resolves.toEqual('<div>include partial</div>');
  });
  
  it('should include partial with partialPath attribute', async () => {
    const str = '<include partial-path="/_sample.html" data="{title: \'include partial\'}"></include>'
    const inc = new Include({
      fileObject: {fileDirectoryPath: '/'},
      attributes: {
        partialPath: '/_sample.html',
        data: {title: 'include partial'}
      },
      partialFiles: [{...partialFile, render: async ({title}) => `<div>${title}</div>`}]
    });

    await expect(inc.render()).resolves.toEqual('<div>include partial</div>');
    await expect(transform(str, {
      partialFileObjects: [partialFile],
      fileObject: {fileDirectoryPath: '/'}
    })).resolves.toEqual('<div>include partial</div>');
  });
  
  it('should render blank if no partial info is provided', async () => {
    const str = '<include></include>'
    const inc = new Include({
      attributes: {}
    });
  
    await expect(inc.render()).resolves.toEqual('');
    await expect(transform(str)).resolves.toEqual('');
  });
  
  describe('should fail if', () => {
    it('non object literal data attribute value is provided', async () => {
      const str = '<include data="sample"></include>'
  
     expect(() => new Include({attributes: {data: 'sample'}}))
        .toThrowError('The "<include>" tag "data" attribute value must be a normal object literal');
      await expect(transform(str))
        .rejects.toThrowError('The "<include>" tag "data" attribute value must be a normal object literal');
    });
  });
});