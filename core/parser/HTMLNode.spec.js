const {HTMLNode, parseHTMLString} = require('./HTMLNode');
const {Attr} = require('./Attr');
const {Text} = require('./Text');
const {Comment} = require('./Comment');

describe('HTMLNode', () => {
  describe('should render', () => {
    it('self closing tag', () => {
      const meta = new HTMLNode('meta', 'http-equiv="X-UA-Compatible" content="ie=edge"');
      
      expect(meta.toString()).toBe('<meta http-equiv="X-UA-Compatible" content="ie=edge">')
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
  
  describe('children', () => {
    let title;
    
    beforeEach(() => {
      title = new HTMLNode('h2');
    })
    
    it('should append and remove child', () => {
      const com = new Comment('secondary title');
      const txt = new Text('main title');
      const hr = new HTMLNode('hr');
  
      title.appendChild(com)
      title.appendChild(txt)
      title.appendChild(hr)
      title.appendChild('')
      title.appendChild(null)
  
      expect(title.toString()).toBe('<h2><!-- secondary title -->main title<hr></h2>');
      
      title.removeChild(com);
  
      expect(title.toString()).toBe('<h2>main title<hr></h2>');
  
      title.removeChild(txt);
  
      expect(title.toString()).toBe('<h2><hr></h2>');
  
      title.removeChild(hr);
  
      expect(title.toString()).toBe('<h2></h2>');
      
    });
  
    it('should replace child', () => {
      const txt = new Text('main title');
      
      title.appendChild(txt);
  
      expect(title.toString()).toBe('<h2>main title</h2>');
  
      title.replaceChild(new Text('replacement title'), txt);
  
      expect(title.toString()).toBe('<h2>replacement title</h2>');
    });
  
    it('should set/get text content', () => {
      title.textContent = 'main title';
  
      expect(title.textContent).toBe('main title');
      expect(title.toString()).toBe('<h2>main title</h2>');
      expect(title.childNodes.length).toBe(1);
  
      title.textContent = '<span>wrapper title</span>';
  
      expect(title.textContent).toBe('wrapper title');
      expect(title.toString()).toBe('<h2>wrapper title</h2>');
      expect(title.childNodes.length).toBe(1);
    });
    
    it('should set inner html', () => {
      title.innerHTML = 'main <span>title</span>';
  
      expect(title.innerHTML).toBe('main <span>title</span>');
      expect(title.toString()).toBe('<h2>main <span>title</span></h2>');
      expect(title.childNodes.length).toBe(2);
      expect(title.children.length).toBe(1);
    });
  })
  
  describe('toString/parse', () => {})
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
        <!-- logo -->
        <h1>Page</h1>
        
        <script src="app.js" type="module"></script>
    </body>
    </html>
    `;
  
  it('should parse content and keep all white space intact', () => {
    const root = parseHTMLString(basicPageMarkup);
    
    expect(root.tagName).toEqual(null);
    expect(root.toString()).toEqual(basicPageMarkup);
  });
})
