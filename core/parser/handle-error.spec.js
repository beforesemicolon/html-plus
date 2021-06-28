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
  
    try {
      handleError({message: 'failed at something'}, htmlNode)
    } catch(e) {
      expect(e.message).toEqual('Error: [91mfailed at something[39m\n' +
        'Markup: [32m<h1 id="main-title">my title</h1>[39m')
    }
  });
  
  it('should throw error with markup and file info', () => {
    const htmlNode = new HTMLElement('h1', {id: 'main-title'}, 'id="main-title"', null);
    htmlNode.textContent = 'my title';
    
    try {
      handleError(
        {message: 'not so good'},
        htmlNode,
        {file: {filePath: '/path/to/file.html'}})
    } catch(e) {
        expect(e.message).toEqual('Error: [91mnot so good[39m\n' +
          'File: [33m/path/to/file.html[39m\n' +
          'Markup: [32m<h1 id="main-title">my title</h1>[39m')
    }
  });
  
  it('should throw error with markup and file info replacing text', () => {
    const htmlNode = new HTMLElement('h1', {id: 'main-title'}, 'id="main-title"', null);
    htmlNode.textContent = 'my title';
  
    try {
      handleError(
        {message: 'Failed <=> my title'},
        htmlNode,
        {file: {filePath: '/path/to/file.html'}})
    } catch(e) {
      expect(e.message).toEqual('Error: [91mFailed [39m\n' +
        'File: [33m/path/to/file.html[39m\n' +
        'Markup: [32m<h1 id="main-title">[91m[39m[32m[39m\n' +
        '[32m[91mmy title <= Error: Failed [39m[32m[39m\n' +
        '[32m[91m[39m[32m</h1>[39m')
    }
  });
});