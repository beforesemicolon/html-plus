const {HTMLElement} = require("node-html-parser");
const {handleError} = require('./handle-error');
const {Text} = require('./Text');

describe('handleError', () => {
  it('should throw error message separated by <=> if text node', () => {
    const text = new Text('some text');
    
    expect(() => handleError({message: 'Failed'}, text)).toThrowError('Failed <=> some text')
  });
  
  it('should throw error as is if message starts with "Error"', () => {
  
    expect(() => handleError({message: 'Error: failed at something'}, {})).toThrowError('Error: failed at something')
  });
  
  it('should throw error with markup', () => {
    const htmlNode = new HTMLElement('h1', {id: 'main-title'}, 'id="main-title"', null);
    htmlNode.textContent = 'my title';
  
    expect(() => handleError({message: 'failed at something'}, htmlNode))
      .toThrowErrorMatchingSnapshot('Error: failed at something\n' +
        'Markup: <h1 id="main-title">my title</h1>')
  });
  
  it('should throw error with markup and file info', () => {
    const htmlNode = new HTMLElement('h1', {id: 'main-title'}, 'id="main-title"', null);
    htmlNode.textContent = 'my title';
    
    expect(() => handleError(
      {message: 'not so good'},
      htmlNode,
      {file: {filePath: '/path/to/file.html'}})
    )
      .toThrowErrorMatchingSnapshot('Error: not so good\n' +
        'File: /path/to/file.html\n' +
        'Markup: <h1 id="main-title">my title</h1>')
  });
  
  it('should throw error with markup and file info replacing text', () => {
    const htmlNode = new HTMLElement('h1', {id: 'main-title'}, 'id="main-title"', null);
    htmlNode.textContent = 'my title';
    
    expect(() => handleError(
      {message: 'Failed <=> my title'},
      htmlNode,
      {file: {filePath: '/path/to/file.html'}})
    )
      .toThrowErrorMatchingSnapshot('Error: Failed \n' +
        'File: /path/to/file.html\n' +
        'Markup: <h1 id=\\"main-title\\">\n' +
        'my title <= Error: Failed \n' +
        '</h1>')
  });
});