const {readFileContent} = require('./readFileContent');
const cp = require('child_process');
const path = require('path');
const {promisify} = require('util');

const exec = promisify(cp.exec);

describe('readFileContent', () => {
  const fileName = path.resolve(__dirname, './___test.txt');
  const fileContent = 'some text';
  
  beforeAll(async () => {
    await exec(`echo "${fileContent}" >> ${fileName}`);
  });
  
  afterAll(async () => {
    await exec(`rm ${fileName}`);
  });
  
  it('should read file content', () => {
    expect.assertions(1);
    const content = readFileContent(fileName);
    
    expect(content.trim()).toBe(fileContent);
  });
  
  it('should return empty string if file does not exist', () => {
    expect.assertions(1);
    const content = readFileContent('');
    
    expect(content).toBe(null);
  });
});