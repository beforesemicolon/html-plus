const {HTMLNode, parseHTMLString} = require('./HTMLNode');
const {Attr} = require('./Attr');

describe('HTMLNode', () => {
  describe('should render', () => {
    it('self closing tag', () => {
      const meta = new HTMLNode('meta', 'http-equiv="X-UA-Compatible" content="ie=edge"');
      
      expect(meta.toString()).toBe('<meta http-equiv="X-UA-Compatible" content="ie=edge"/>')
    });
    
    it('open closed tag', () => {
      const title = new HTMLNode('title');
  
      expect(title.toString()).toBe('<title></title>')
    });
  });
  
  describe('attributes', () => {
    let anchor;
    
    beforeEach(() => {
      anchor = new HTMLNode('a');
    })
    
    it('should render tag with attributes', () => {
      expect(anchor.toString()).toBe('<a></a>')
    });
    
    it('should say if node has attributes', () => {
      expect(anchor.hasAttributes()).toBeFalsy();
    });
    
    it('should set attribute and attribute node', () => {
      anchor.setAttribute('href', 'path/to/page');
      anchor.setAttributeNode(new Attr('download'));
  
      expect(anchor.toString()).toBe('<a href="path/to/page" download></a>')
    });
    
    it('should check if it has attribute', () => {
      anchor.setAttribute('href', 'path/to/page');
      
      expect(anchor.hasAttributes()).toBeTruthy();
      expect(anchor.hasAttribute('href')).toBeTruthy();
      expect(anchor.hasAttribute('download')).toBeFalsy();
    });
    
    it('should get attribute names', () => {
      anchor.setAttribute('href', 'path/to/page');
      anchor.setAttributeNode(new Attr('download'));
  
      expect(anchor.getAttributeNames()).toEqual(["href", "download"]);
    });
    
    it('should get attribute and attribute node', () => {
      anchor.setAttribute('href', 'path/to/page');
  
      expect(anchor.getAttribute('href')).toEqual('path/to/page');
      expect(anchor.getAttributeNode('href')).toBeInstanceOf(Attr);
    });
  
    it('should remove attribute or attribute node', () => {
      anchor.setAttribute('href', 'path/to/page');
      anchor.setAttribute('download');
  
      expect(anchor.toString()).toBe('<a href="path/to/page" download></a>')
      
      anchor.removeAttribute('href');
      
      expect(anchor.toString()).toBe('<a download></a>')
      
      anchor.removeAttributeNode(new Attr('download'));
  
      expect(anchor.toString()).toBe('<a></a>')
    });
  })
  
  describe('children', () => {})
  
  describe('toString/parse', () => {})
  
  describe('innerHTML', () => {})
  
  describe('content', () => {})
})

describe('parseHTMLString', () => {
  const basicPageMarkup = `
    <!doctype html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Document</title>
        <link rel="stylesheet" href="style.css">
    </head>
    <body>
        <h1>Page</h1>
        
        <script src="app.js" type="module"></script>
    </body>
    </html>
  `;
  
  describe('should parse node', () => {})
  
  describe('should parse text', () => {})
  
  describe('should parse comment', () => {})
  
  describe('should call callback on every node', () => {})
})
