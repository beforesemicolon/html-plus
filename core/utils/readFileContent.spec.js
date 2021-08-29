const {readFileContent} = require('./readFileContent');
const {writeFile, unlink} = require('../utils/fs-promise');
const path = require('path');

describe('readFileContent', () => {
  const fileName = path.resolve(__dirname, './___test.txt');
  const fileContent = 'some text';
  
  beforeAll(async () => {
    await writeFile(fileName, fileContent)
  });
  
  afterAll(async () => {
    await unlink(fileName);
  });
  
  it('should read file content', () => {
    expect.assertions(1);
    const content = readFileContent(fileName);
    
    expect(content.trim()).toBe(fileContent);
  });
  
  it('should throw error if file does not exist', () => {
    expect.assertions(1);
    
    expect(() => readFileContent('file.png'))
      .toThrowError('ENOENT: no such file or directory, open');
  });
});
