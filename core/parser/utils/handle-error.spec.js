jest.mock('chalk', () => ({
  green: str => str,
  yellow: str => str,
  redBright: str => str,
}));

const {Element} = require('../Element');
const {handleError} = require('./handle-error');
const {Text} = require('../Text');

describe('handleError', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  })
  
  it('should throw error message with the text markup', () => {
    const text = new Text('some text');
    
    try {
      handleError({message: 'Failed'}, text)
    } catch(e) {
      expect(e.message).toEqual('Error: Failed\n' +
        'Markup: some text')
    }
    
  });
  
  it('should throw error as is if message starts with "Error"', () => {
    expect(() => handleError({message: 'Error: failed at something'}, {})).toThrowError('Error: failed at something')
  });
  
  it('should throw error with markup', () => {
    const htmlNode = new Element('h1');
    htmlNode.setAttribute('id', 'main-title')
    htmlNode.textContent = 'my title';
  
    try {
      handleError({message: 'failed at something'}, htmlNode)
    } catch(e) {
      expect(e.message.includes('failed at something')).toBeTruthy()
      expect(e.message.includes('<h1 id="main-title">my title</h1>')).toBeTruthy()
    }
  });
  
  it('should throw error with markup and file info', () => {
    const htmlNode = new Element('h1');
    htmlNode.setAttribute('id', 'main-title')
    htmlNode.textContent = 'my title';
    
    try {
      handleError(
        {message: 'not so good'},
        htmlNode,
        {filePath: '/path/to/file.html'})
    } catch(e) {
        expect(e.message.includes('not so good')).toBeTruthy()
        expect(e.message.includes('/path/to/file.html')).toBeTruthy()
        expect(e.message.includes('<h1 id="main-title">my title</h1>')).toBeTruthy()
    }
  });
  
  it('should throw error with markup and file info replacing text', () => {
    const htmlNode = new Element('h1', 'id="main-title"');
    htmlNode.textContent = 'my title';
  
    try {
      handleError(
        {message: 'Failed'},
        htmlNode,
        {filePath: '/path/to/file.html'})
    } catch(e) {
      expect(e.message).toEqual('Error: Failed\n' +
        'File: /path/to/file.html\n' +
        'Markup: <h1>my title</h1>')
    }
  });
});
