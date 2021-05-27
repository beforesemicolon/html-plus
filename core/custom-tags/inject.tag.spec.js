const {Inject} = require('./inject.tag');
const {transform} = require('./../transform');

describe('Inject', () => {
  const partialFile = {
    name: '_sample',
    fileAbsolutePath: '/_sample.html',
    content: '<inject></inject>'
  };
  
  it('should render blank if no root children', async () => {
    const str = '<inject></inject>';
    const inject = new Inject({rootChildren: null, children: () => [], attributes: {}});
    
    await expect(inject.render()).resolves.toEqual('');
    await expect(transform(str)).resolves.toEqual('');
  });
  
  it('should render all include children if no id provided', async () => {
    const str = '<include partial="sample"><p>1</p><p>2</p><p>3</p></include>';
  
    await expect(transform(str, {
      partialFileObjects: [partialFile]
    })).resolves.toEqual('<p>1</p>\n' +
      '<p>2</p>\n' +
      '<p>3</p>');
  });
  
  it('should render own children if include has no children', async () => {
    partialFile.content = '<inject><p>default content</p></inject>'
    const str = '<include partial="sample"></include>';
  
    await expect(transform(str, {
      partialFileObjects: [partialFile]
    })).resolves.toEqual('<p>default content</p>');
  });
  
  it('should render single include child with same id', async () => {
    partialFile.content = '<inject id="target"></inject>'
    const str = '<include partial="sample"><p>1</p><p #inject="target">2</p><p>3</p><</include>';
  
    await expect(transform(str, {
      partialFileObjects: [partialFile]
    })).resolves.toEqual('<p>2</p>');
  });
  
  it('should render own children if no include children has same id', async () => {
    partialFile.content = '<inject id="target"><p>default</p></inject>'
    const str = '<include partial="sample"><p>1</p><p>2</p><p>3</p><</include>';
  
    await expect(transform(str, {
      partialFileObjects: [partialFile]
    })).resolves.toEqual('<p>default</p>');
  });
});