const path = require('path');
const {writeFile, unlink} = require('../utils/fs-promise');
const {PartialFile} = require('./PartialFile');
const {RenderNode} = require("./RenderNode");

describe('PartialFile', () => {
  it('should throw error if partial name does not start with underscore', () => {
    expect(() => new PartialFile('partial.html'))
      .toThrowError('Cannot create partial file. Partial files must start with underscore(_).')
  });
  
  it('should throw error if partial file is not an html file', () => {
    expect(() => new PartialFile('_partial.js'))
      .toThrowError('Cannot create partial file. Partial files must be an HTML file.')
  });
  
  it('should throw error if file does not exist', () => {
    expect(() => new PartialFile('pages/_partial.html'))
      .toThrowError('no such file or directory');
  });
  
  describe('on real file', () => {
    const filePath = path.join(__dirname, '_partial.html');
    let partial;
    
    beforeAll(async () => {
      await writeFile(filePath, '<h2>{title}</h2>', 'utf-8');
      partial = new PartialFile(filePath);
    })
    
    afterAll(async () => {
      await unlink(filePath);
    })
    
    it('should create a partial file', () => {
      expect(partial.content).toEqual('<h2>{title}</h2>');
    });
    
    it('should render partial content', () => {
      const renderNode = partial.render({title: 'My partial'});
      
      expect(renderNode).toBeInstanceOf(RenderNode);
      expect(renderNode)
        .toEqual({
          "context": {
            "title": "My partial"
          },
          "file": {
            "resources": []
          },
          "htmlString": "<h2>{title}</h2>"
        })
    });
  });
  
  
});
