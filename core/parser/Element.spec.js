const {Element, parseHTMLString} = require('./Element');
const {Attr} = require('./Attr');
const {Text} = require('./Text');
const {Comment} = require('./Comment');

describe('Element', () => {
  describe('should render', () => {
    it('self closing tag', () => {
      const meta = new Element('meta', 'http-equiv="X-UA-Compatible" content="ie=edge"');

      expect(meta.toString()).toBe('<meta http-equiv="X-UA-Compatible" content="ie=edge">')
    });

    it('open closed tag', () => {
      const title = new Element('title');

      expect(title.toString()).toBe('<title></title>')
    });
  });

  describe('attributes', () => {
    let anchor;

    beforeEach(() => {
      anchor = new Element('a');
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
      title = new Element('h2');
    })

    it('should get childNodes and children', () => {
      const ul = parseHTMLString('<ul>' +
        '<li>item 1</li>' +
        'some before text <li>item 2</li> some after text' +
        '<li>item 3</li>' +
        '</ul>').children[0];

      expect(ul.childNodes.length).toBe(5)
      expect(ul.children.length).toBe(3)
    });

    it('should append and remove child', () => {
      const com = new Comment('secondary title');
      const txt = new Text('main title');
      const hr = new Element('hr');

      title.appendChild(com)
      title.appendChild(txt)
      title.insertAdjacentElement('beforeend', hr)
      title.appendChild('')
      title.appendChild(null)

      expect(title.toString()).toBe('<h2><!-- secondary title -->main title<hr></h2>');
      expect(com.parentNode).toEqual(title);
      expect(txt.parentNode).toEqual(title);
      expect(hr.parentNode).toEqual(title);

      title.removeChild(com);

      expect(title.toString()).toBe('<h2>main title<hr></h2>');

      title.removeChild(txt);

      expect(title.toString()).toBe('<h2><hr></h2>');

      title.removeChild(hr);

      expect(title.toString()).toBe('<h2></h2>');
      expect(com.parentNode).toEqual(null);
      expect(txt.parentNode).toEqual(null);
      expect(hr.parentNode).toEqual(null);
    });

    it('should replace child', () => {
      const txt = new Text('main title');

      title.appendChild(txt);

      expect(title.toString()).toBe('<h2>main title</h2>');
      expect(txt.parentNode).toEqual(title);

      const newTxt = new Text('replacement title');

      title.replaceChild(newTxt, txt);

      expect(title.toString()).toBe('<h2>replacement title</h2>');
      expect(txt.parentNode).toEqual(null);
      expect(newTxt.parentNode).toEqual(title);
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

    it('should prepend', () => {
      const hr = new Element('hr');
  
      title.appendChild(new Text('main title'))
      title.insertAdjacentElement('afterbegin', hr);
  
      expect(title.toString()).toBe('<h2><hr>main title</h2>');
    });
  })

  describe('siblings', () => {
    let ul, secItem;

    beforeEach(() => {
      ul = parseHTMLString('<ul>' +
        '<li>item 1</li>' +
        'some before text <li>item 2</li> some after text' +
        '<li>item 3</li>' +
        '</ul>').children[0];
      secItem = ul.children[1];
    })

    it('should get prev and next sibling and element sibling', () => {
      expect(secItem.prevSibling.toString()).toEqual('some before text ');
      expect(secItem.prevElementSibling.toString()).toEqual('<li>item 1</li>');
      expect(secItem.prevElementSibling.prevElementSibling).toEqual(null);
      expect(secItem.toString()).toEqual('<li>item 2</li>');
      expect(secItem.nextSibling.toString()).toEqual(' some after text');
      expect(secItem.nextElementSibling.toString()).toEqual('<li>item 3</li>');
      expect(secItem.nextElementSibling.nextElementSibling).toEqual(null);
    });

    it('should insert before', () => {
      const com = new Comment('sec item');
      const txt = new Text('sample');

      ul.insertBefore(com, secItem);

      expect(ul.toString()).toEqual('<ul><li>item 1</li>some before text <!-- sec item --><li>item 2</li> some after text<li>item 3</li></ul>');

      secItem.before(txt);

      expect(ul.toString()).toEqual('<ul><li>item 1</li>some before text <!-- sec item -->sample<li>item 2</li> some after text<li>item 3</li></ul>');
    });

    it('should insert after', () => {
      const txt = new Text('sample');

      secItem.after(txt);

      expect(ul.toString()).toEqual('<ul><li>item 1</li>some before text <li>item 2</li>sample some after text<li>item 3</li></ul>');
  
      secItem.nextElementSibling.after(txt);
      
      expect(ul.toString()).toEqual('<ul><li>item 1</li>some before text <li>item 2</li>sample some after text<li>item 3</li>sample</ul>');
    });

    it('should insert only when correct thing provided', () => {
      const div = new Element('div');

      div.insertAdjacentText('afterbegin', new Comment('some comment'))
      div.insertAdjacentText('afterbegin', 'some text')
      div.insertAdjacentText('afterbegin', new Element('span'))

      expect(div.toString()).toBe('<div>some text</div>')

      div.innerHTML = '';

      div.insertAdjacentHTML('afterbegin', new Comment('some comment'))
      div.insertAdjacentHTML('afterbegin', '<span>text</span>')
      div.insertAdjacentHTML('afterbegin', 'some')

      expect(div.toString()).toBe('<div>some<span>text</span></div>')

      div.innerHTML = '';

      div.insertAdjacentElement('afterbegin', new Comment('some comment'))
      div.insertAdjacentElement('afterbegin', new Element('span'))
      div.insertAdjacentElement('afterbegin', new Text('some text'))

      expect(div.toString()).toBe('<div><span></span></div>')
    });
  });

  describe('toString/parse', () => {
  
  })

  it('should clone node', () => {
    const parent = new Element('div');
    const anchor = new Element('a', 'href="path/to/page" download #if="valid === true"');
    parent.appendChild(anchor);
    anchor.setContext('valid', true);
    const anchorClone = anchor.cloneNode(true);
    anchorClone.setContext('sample', 10);

    expect(anchor !== anchorClone).toBeTruthy();
    expect(anchor.outerHTML).toEqual('<a href="path/to/page" download #if="valid === true"></a>');
    expect(anchor.context).toEqual({valid: true});
    expect(anchor.parentNode).toEqual(parent);
    expect(anchorClone.outerHTML).toEqual('<a href="path/to/page" download #if="valid === true"></a>');
    expect(anchorClone.context).toEqual({sample: 10, valid: true});
    expect(anchorClone.parentNode).toEqual(null);
  });
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
    expect(root.toString()).toEqual('');
  });
  
  it('should set node context', () => {
    const root = parseHTMLString(basicPageMarkup, {sample: 10});
    const title = root.children[1].children[0].children[3];
    
    expect(root.tagName).toEqual(null);
    expect(title.tagName).toBe('title')
  });
})
