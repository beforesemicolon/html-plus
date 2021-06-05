const cp = require('child_process');
const path = require('path');
const {PartialFile} = require('./PartialFile');
const {promisify} = require('util');

const exec = promisify(cp.exec);

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
  
    beforeAll(async () => {
      await exec(`echo "<h2>{title}</h2>" >> ${filePath}`);
    })
  
    afterAll(async () => {
      await exec(`rm "${filePath}"`);
    })
  
    it('should create a partial file', () => {
      const partial = new PartialFile(filePath);
    
      expect(partial.content).toEqual('<h2>{title}</h2>\n');
    });
  
    it('should render partial content', () => {
      const partial = new PartialFile(filePath);
  
     return expect(partial.render({title: 'My partial'}))
       .resolves.toEqual('<h2>My partial</h2>')
    });
  });
  
 
});