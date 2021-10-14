const {parse} = require(".");
const {Text} = require("./Text");

describe('parse', () => {
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
    const root = parse(basicPageMarkup);
    
    expect(root.tagName).toEqual(null);
    expect(root.toString().replace(/\s+/g, '')).toEqual(`
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
        <!--  logo  -->
        <h1>Page</h1>
        
        <script src="app.js" type="module"></script>
    </body>
    </html>
    `.replace(/\s+/g, ''));
  });
  
  it('should set node context', () => {
    const root = parse(basicPageMarkup);
    root.context = {sample: 10};
    const title = root.children[1].children[0].children[3];
    
    expect(root.tagName).toEqual(null);
    expect(title.tagName).toBe('title')
  });
  
  describe('should handle self-closing tag', () => {
    it('when known HTML self closing tag ', () => {
      const root = parse('<meta charset="UTF-8">');
      
      expect(root.children.length).toBe(1);
      expect(root.children[0].tagName).toBe('meta');
      expect(root.children[0].children.length).toBe(0);
      expect(root.children[0].attributes.toString()).toBe('charset="UTF-8"');
    });
    
    it('when custom/new self closing tag with a self closing slash', () => {
      const root = parse('<bfs-img src="img/circle" alt=""/>');
      
      expect(root.children.length).toBe(1);
      expect(root.children[0].tagName).toBe('bfs-img');
      expect(root.children[0].children.length).toBe(0);
      expect(root.children[0].attributes.toString()).toBe('src="img/circle" alt');
    });
    
    it('when repeated next to each other', () => {
      const root = parse('<meta charset="UTF-8">\n<meta http-equiv="X-UA-Compatible" content="ie=edge">');
      
      expect(root.children.length).toBe(2);
      expect(root.children[0].tagName).toBe('meta');
      expect(root.children[1].tagName).toBe('meta');
      expect(root.children[0].children.length).toBe(0);
      expect(root.children[1].children.length).toBe(0);
      expect(root.children[0].attributes.toString()).toBe('charset="UTF-8"');
      expect(root.children[1].attributes.toString()).toBe('http-equiv="X-UA-Compatible" content="ie=edge"');
    });
    
    it('when mixed of know html and custom self-closing tag', () => {
      const root = parse('<meta charset="UTF-8">\n<bfs-img src="img/circle" alt=""/>');
      
      expect(root.children.length).toBe(2);
      expect(root.children[0].tagName).toBe('meta');
      expect(root.children[1].tagName).toBe('bfs-img');
      expect(root.children[0].children.length).toBe(0);
      expect(root.children[1].children.length).toBe(0);
      expect(root.children[0].attributes.toString()).toBe('charset="UTF-8"');
      expect(root.children[1].attributes.toString()).toBe('src="img/circle" alt');
    });
  });
  
  describe('should handle open-closing tag', () => {
    it('when no inner content', () => {
      const root = parse('<p></p>');
      
      expect(root.children.length).toBe(1);
      expect(root.children[0].tagName).toBe('p');
      expect(root.children[0].children.length).toBe(0);
    });
    
    it('with text inside', () => {
      const root = parse('<p>Lorem ipsum dolor.</p>');
      
      expect(root.children.length).toBe(1);
      expect(root.children[0].tagName).toBe('p');
      expect(root.children[0].children.length).toBe(0);
      expect(root.children[0].childNodes.length).toBe(1);
      expect(root.children[0].toString()).toBe('<p>Lorem ipsum dolor.</p>');
      expect(root.children[0].textContent).toBe('Lorem ipsum dolor.');
    });
    
    it('with comment inside', () => {
      const root = parse('<p><!-- content goes here --></p>');
      
      expect(root.children.length).toBe(1);
      expect(root.children[0].tagName).toBe('p');
      expect(root.children[0].children.length).toBe(0);
      expect(root.children[0].childNodes.length).toBe(1);
      expect(root.children[0].toString()).toBe('<p><!-- content goes here --></p>');
      expect(root.children[0].textContent).toBe('');
    });
    
    it('with self closing tag inside', () => {
      const root = parse('<head><meta charset="UTF-8"></head>');
      
      expect(root.children.length).toBe(1);
      expect(root.children[0].tagName).toBe('head');
      expect(root.children[0].children.length).toBe(1);
      expect(root.children[0].childNodes.length).toBe(1);
      expect(root.children[0].toString()).toBe('<head><meta charset="UTF-8"></head>');
      expect(root.children[0].textContent).toBe('');
    });
    
    it('with different open-closing tag inside', () => {
      const root = parse('<head><title>Some title</title></head>');
      
      expect(root.children.length).toBe(1);
      expect(root.children[0].tagName).toBe('head');
      expect(root.children[0].children.length).toBe(1);
      expect(root.children[0].childNodes.length).toBe(1);
      expect(root.children[0].toString()).toBe('<head><title>Some title</title></head>');
      expect(root.children[0].textContent).toBe('Some title');
    });
    
    it('with similar open-closing tag inside', () => {
      const root = parse('<div><div>Some title</div></div>');
      
      expect(root.children.length).toBe(1);
      expect(root.children[0].tagName).toBe('div');
      expect(root.children[0].children.length).toBe(1);
      expect(root.children[0].childNodes.length).toBe(1);
      expect(root.children[0].toString()).toBe('<div><div>Some title</div></div>');
      expect(root.children[0].textContent).toBe('Some title');
    });
    
    it('when no closing slash is present', () => {
      const root = parse('<div><div>Some title<div><div>');
      
      expect(root.toString()).toBe('<div><div>Some title<div><div></div></div></div></div>');
    });
    
  });
  
  describe('should handle text', () => {
    it('when passed alone', () => {
      const root = parse('some text');
      
      expect(root.children.length).toBe(0);
      expect(root.childNodes[0]).toBeInstanceOf(Text);
      expect(root.childNodes[0].textContent).toBe('some text');
    });
    
    it('when in between tags', () => {
      const root = parse('some<hr/> text');
      
      expect(root.children.length).toBe(1);
      expect(root.childNodes.length).toBe(3);
      expect(root.childNodes[0]).toBeInstanceOf(Text);
      expect(root.childNodes[2]).toBeInstanceOf(Text);
      expect(root.textContent).toBe('some text');
    });
    
    it('when after a tag', () => {
      const root = parse('<hr/>some text');
      
      expect(root.children.length).toBe(1);
      expect(root.childNodes.length).toBe(2);
      expect(root.childNodes[1]).toBeInstanceOf(Text);
      expect(root.textContent).toBe('some text');
    });
    
    it('when before a tag', () => {
      const root = parse('some text<hr/>');
      
      expect(root.children.length).toBe(1);
      expect(root.childNodes.length).toBe(2);
      expect(root.childNodes[0]).toBeInstanceOf(Text);
      expect(root.textContent).toBe('some text');
    });
  });
  
  describe('should handle attributes', () => {
    it('when special', () => {
      const root = parse('<p #if="true"></p>');
      
      expect(root.toString()).toBe('<p></p>');
      expect(root.children[0]['#if']).toBe('true');
    });
    
    it('when containing special html symbols as value', () => {
      const root = parse('<p #if="20 > 5"></p>');
      
      expect(root.toString()).toBe('<p></p>');
      expect(root.children[0]['#if']).toBe('20 > 5');
    });
    
    it('when repeated', () => {
      const root = parse('<p #if="20 > 5" #repeat="3" id="sample"></p>');
      
      expect(root.toString()).toBe('<p id="sample"></p>');
      expect(root.children[0]['#if']).toBe('20 > 5');
      expect(root.children[0]['#repeat']).toBe('3');
    });
    
    it('when has empty or no value', () => {
      const root = parse('<a href="" download></a>');
      
      expect(root.toString()).toBe('<a href download></a>');
    });
  });
  
})