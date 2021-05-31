const {File} = require('./File');
const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const {promisify} = require('util');

const exec = promisify(cp.exec);

describe('FileObject', () => {
  const absPath = path.resolve(__dirname, 'file.ext');
  
  it('should create file object with parent directory as src directory', () => {
    const file = new File(absPath);
    
    expect(file.srcDirectoryPath).toBe(`${__dirname}/`);
    expect(file.fileAbsolutePath).toBe(absPath);
  });
  
  it('should create file object with provided src directory', () => {
    const file = new File(absPath, process.cwd());
  
    expect(file.srcDirectoryPath).toBe(process.cwd());
    expect(file.fileAbsolutePath).toBe(absPath);
  });
  
  it('should throw error if content is not string or buffer', () => {
    const file = new File(absPath, process.cwd());
  
    expect(() => file.content = ['sample text'])
      .toThrowError('File content can only be a string or a Buffer type');
  });
  
  it('should throw error if no file path is provided', () => {
    expect(() => new File())
      .toThrowError('\"itemPath\" is required argument');
  });
  
  it('should throw error if file noes not exist when trying to load it', () => {
    const file = new File('file.png');
    
    expect(() => file.load())
      .toThrowError('no such file or directory');
  });
  
  describe('with real file', () => {
    const filePath = path.join(__dirname, 'sample.txt');
    
    beforeAll(async () => {
      await exec(`echo "file content sample" >> ${filePath}`);
    })
    
    afterAll(async () => {
      await exec(`rm "${filePath}"`);
    })
    
    it('should load content', async () => {
      const file = new File('sample.txt', __dirname);
    
      file.load();
    
      expect(file.content).toBe('file content sample\n');
    });
  
    it('should print string version of the file', () => {
      const file = new File('sample.txt', __dirname);
    
      expect(file.toString()).toBe('file content sample\n');
    });
  
    it('should allow to set content', () => {
      const file = new File(absPath, process.cwd());
    
      file.content = 'some text';
    
      expect(file.toString()).toEqual('some text');
    
      file.content = Buffer.from('some text');
    
      expect(file.toString()).toEqual('some text');
  
      file.content  = fs.readFileSync(filePath);
  
      expect(file.toString()).toEqual('file content sample\n');
    });
  });
});