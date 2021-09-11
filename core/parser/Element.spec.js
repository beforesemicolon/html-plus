const {Element, parseHTMLString} = require('./Element');
const {Attr} = require('./Attr');
const {Text} = require('./Text');
const {Comment} = require('./Comment');

describe('Element', () => {
  describe('should render', () => {
    it('self closing tag', () => {
      const meta = new Element('meta');
      meta.setAttribute('http-equiv', 'X-UA-Compatible');
      meta.setAttribute('content', 'ie=edge');
      
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
    
    it('should get and set id', () => {
      const div = new Element('div');
      div.id = 'sample';
      
      expect(div.id).toEqual('sample');
      expect(div.getAttribute('id')).toEqual('sample');
    });
    
    it('should get and set className', () => {
      const div = new Element('div');
      div.className = 'sample-cls container';
      
      expect(div.className).toEqual('sample-cls container');
      expect(div.getAttribute('class')).toEqual('sample-cls container');
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
  
  describe('querySelector', () => {
    const node = parseHTMLString(`
      <section class="block">
        <h2 id="main-title">Some title</h2>
        <ul class="list">
            <li class="item" name="">item 1</li>
            <li class="item">item 2</li>
            <li class="item">item 3</li>
            <li class="item">item 4</li>
            <li class="item special-item">
                <span>more</span>
                <ul class="sub-menu" id="more-menu">
                  <li>sub item 1</li>
                  <li class="last">sub item 2</li>
                </ul>
            </li>
        </ul>
        <a href="/path/to/page" download class="">view</a>
      </section>
    `);
  
    it('should try to match single selector at any level', () => {
      const section = node.querySelector('section');
      const h2 = node.querySelector('h2');
      const ulList = node.querySelector('.list');
      const a = node.querySelector('a');
      const liSpecialItem = node.querySelector('.special-item');
      const span = node.querySelector('span');
      const ulMoreMenu = node.querySelector('#more-menu');
      const h3 = node.querySelector('h3');
      
      expect(section?.tagName).toBe('section')
      expect(h2?.tagName).toBe('h2')
      expect(ulList?.tagName).toBe('ul')
      expect(a?.tagName).toBe('a')
      expect(liSpecialItem?.tagName).toBe('li')
      expect(span?.tagName).toBe('span')
      expect(ulMoreMenu?.tagName).toBe('ul')
      expect(h3).toBeNull()
    });
    
    it('should try to match compound single selector at any level', () => {
      const a = node.querySelector('a[download]');
      const ul = node.querySelector('ul#more-menu.sub-menu');
      const specialLi = node.querySelector('li.special-item');
      const nameLi = node.querySelector('li[name].item');
      const aClassed = node.querySelector('a.link');
  
      expect(a?.tagName).toBe('a')
      expect(ul?.tagName).toBe('ul')
      expect(specialLi?.tagName).toBe('li')
      expect(nameLi?.tagName).toBe('li')
      expect(aClassed).toBeNull()
    });
  
    it('should throw error if invalid selector', () => {
      expect(() => node.querySelector('> span')).toThrowError('Failed to execute \'querySelector\' on \'Element\': \'> span\' is not a valid selector.')
      expect(() => node.querySelector('section > + span')).toThrowError('Failed to execute \'querySelector\' on \'Element\': \'section > + span\' is not a valid selector.')
      expect(() => node.querySelector('section > span +')).toThrowError('Failed to execute \'querySelector\' on \'Element\': \'section > span +\' is not a valid selector.')
    });
  
    it('should handle global selector', () => {});
  
    describe('should handle combinators', () => {
      it('descendent', () => {
        const a = node.querySelector('section a');
        const span = node.querySelector('.list span');
        const li = node.querySelector('.special-item li');
  
        expect(a?.tagName).toBe('a')
        expect(span?.tagName).toBe('span')
        expect(li?.tagName).toBe('li')
      });
  
      it('direct child', () => {
        const ul = node.querySelector('li > ul');
        const noNestedUl = node.querySelector('ul > ul');
        const a = node.querySelector('section > [download]');
        const span = node.querySelector('.special-item > span');
        const h2 = node.querySelector('article > h2');
        
        expect(ul?.tagName).toBe('ul')
        expect(noNestedUl).toBeNull()
        expect(a?.tagName).toBe('a')
        expect(span?.tagName).toBe('span')
        expect(h2).toBeNull()
      });
  
      it('next sibling', () => {
        const a = node.querySelector('ul + a');
        const ul = node.querySelector('span + ul');
        const li = node.querySelector('[name] + li');
        const specialLi = node.querySelector('li + .special-item');
        const lastLi = node.querySelector('li + .last');
        const subMenu = node.querySelector('p + .sub-menu');
  
        expect(a?.tagName).toBe('a')
        expect(ul?.tagName).toBe('ul')
        expect(li?.tagName).toBe('li')
        expect(specialLi?.tagName).toBe('li')
        expect(lastLi?.tagName).toBe('li')
        expect(subMenu).toBeNull()
      });
  
      it('siblings', () => {
        const specialLi = node.querySelector('[name] ~ .special-item');
        const a = node.querySelector('#main-title ~ [download]');
        const lastLi = node.querySelector('li ~ .last');
        const firstSpecialLi = node.querySelector('[name].first ~ .special-item');
  
        expect(specialLi?.tagName).toBe('li')
        expect(a?.tagName).toBe('a')
        expect(lastLi?.tagName).toBe('li')
        expect(firstSpecialLi).toBeNull()
      });
    });
    
    describe('should handle attributes', () => {
      describe('class', () => {})
      
      describe('id', () => {})
      
      describe('with square bracket notation', () => {
        it('blank', () => {});
        
        it('name only', () => {});
        
        describe('name and value', () => {
          it('only', () => {});
          
          it('where name is style', () => {});
          
          it('where name is class', () => {});
          
          it('where value is an empty string', () => {});
          
          it('with ~ operator', () => {});
          
          it('with ^ operator', () => {});
          
          it('with $ operator', () => {});
          
          it('with | operator', () => {});
          
          it('with * operator', () => {});
          
          it('with i modifier', () => {});
          
          it('with s modifier', () => {});
        });
      })
    })
  
    describe('should handle pseudo-class', () => {})
  });
  
  it('should clone node', () => {
    const parent = new Element('div');
    const anchor = new Element('a');
    anchor.setAttribute('href', 'path/to/page');
    anchor.setAttribute('download');
    anchor.setAttribute('#if', 'valid === true');
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
    const root = parseHTMLString(basicPageMarkup, {sample: 10});
    const title = root.children[1].children[0].children[3];
    
    expect(root.tagName).toEqual(null);
    expect(title.tagName).toBe('title')
  });
  
  describe('should handle self-closing tag', () => {
    it('when known HTML self closing tag ', () => {
      const root = parseHTMLString('<meta charset="UTF-8">');
      
      expect(root.children.length).toBe(1);
      expect(root.children[0].tagName).toBe('meta');
      expect(root.children[0].children.length).toBe(0);
      expect(root.children[0].attributes.toString()).toBe('charset="UTF-8"');
    });
    
    it('when custom/new self closing tag with a self closing slash', () => {
      const root = parseHTMLString('<bfs-img src="img/circle" alt=""/>');
      
      expect(root.children.length).toBe(1);
      expect(root.children[0].tagName).toBe('bfs-img');
      expect(root.children[0].children.length).toBe(0);
      expect(root.children[0].attributes.toString()).toBe('src="img/circle" alt');
    });
    
    it('when repeated next to each other', () => {
      const root = parseHTMLString('<meta charset="UTF-8">\n<meta http-equiv="X-UA-Compatible" content="ie=edge">');
      
      expect(root.children.length).toBe(2);
      expect(root.children[0].tagName).toBe('meta');
      expect(root.children[1].tagName).toBe('meta');
      expect(root.children[0].children.length).toBe(0);
      expect(root.children[1].children.length).toBe(0);
      expect(root.children[0].attributes.toString()).toBe('charset="UTF-8"');
      expect(root.children[1].attributes.toString()).toBe('http-equiv="X-UA-Compatible" content="ie=edge"');
    });
    
    it('when mixed of know html and custom self-closing tag', () => {
      const root = parseHTMLString('<meta charset="UTF-8">\n<bfs-img src="img/circle" alt=""/>');
      
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
      const root = parseHTMLString('<p></p>');
      
      expect(root.children.length).toBe(1);
      expect(root.children[0].tagName).toBe('p');
      expect(root.children[0].children.length).toBe(0);
    });
    
    it('with text inside', () => {
      const root = parseHTMLString('<p>Lorem ipsum dolor.</p>');
      
      expect(root.children.length).toBe(1);
      expect(root.children[0].tagName).toBe('p');
      expect(root.children[0].children.length).toBe(0);
      expect(root.children[0].childNodes.length).toBe(1);
      expect(root.children[0].toString()).toBe('<p>Lorem ipsum dolor.</p>');
      expect(root.children[0].textContent).toBe('Lorem ipsum dolor.');
    });
    
    it('with comment inside', () => {
      const root = parseHTMLString('<p><!-- content goes here --></p>');
      
      expect(root.children.length).toBe(1);
      expect(root.children[0].tagName).toBe('p');
      expect(root.children[0].children.length).toBe(0);
      expect(root.children[0].childNodes.length).toBe(1);
      expect(root.children[0].toString()).toBe('<p><!-- content goes here --></p>');
      expect(root.children[0].textContent).toBe('');
    });
    
    it('with self closing tag inside', () => {
      const root = parseHTMLString('<head><meta charset="UTF-8"></head>');
      
      expect(root.children.length).toBe(1);
      expect(root.children[0].tagName).toBe('head');
      expect(root.children[0].children.length).toBe(1);
      expect(root.children[0].childNodes.length).toBe(1);
      expect(root.children[0].toString()).toBe('<head><meta charset="UTF-8"></head>');
      expect(root.children[0].textContent).toBe('');
    });
    
    it('with different open-closing tag inside', () => {
      const root = parseHTMLString('<head><title>Some title</title></head>');
      
      expect(root.children.length).toBe(1);
      expect(root.children[0].tagName).toBe('head');
      expect(root.children[0].children.length).toBe(1);
      expect(root.children[0].childNodes.length).toBe(1);
      expect(root.children[0].toString()).toBe('<head><title>Some title</title></head>');
      expect(root.children[0].textContent).toBe('Some title');
    });
    
    it('with similar open-closing tag inside', () => {
      const root = parseHTMLString('<div><div>Some title</div></div>');
      
      expect(root.children.length).toBe(1);
      expect(root.children[0].tagName).toBe('div');
      expect(root.children[0].children.length).toBe(1);
      expect(root.children[0].childNodes.length).toBe(1);
      expect(root.children[0].toString()).toBe('<div><div>Some title</div></div>');
      expect(root.children[0].textContent).toBe('Some title');
    });
    
    it('when no closing slash is present', () => {
      const root = parseHTMLString('<div><div>Some title<div><div>');
      
      expect(root.toString()).toBe('<div><div>Some title<div><div></div></div></div></div>');
    });
    
  });
  
  describe('should handle text', () => {
    it('when passed alone', () => {
      const root = parseHTMLString('some text');
      
      expect(root.children.length).toBe(0);
      expect(root.childNodes[0]).toBeInstanceOf(Text);
      expect(root.childNodes[0].textContent).toBe('some text');
    });
    
    it('when in between tags', () => {
      const root = parseHTMLString('some<hr/> text');
      
      expect(root.children.length).toBe(1);
      expect(root.childNodes.length).toBe(3);
      expect(root.childNodes[0]).toBeInstanceOf(Text);
      expect(root.childNodes[2]).toBeInstanceOf(Text);
      expect(root.textContent).toBe('some text');
    });
    
    it('when after a tag', () => {
      const root = parseHTMLString('<hr/>some text');
      
      expect(root.children.length).toBe(1);
      expect(root.childNodes.length).toBe(2);
      expect(root.childNodes[1]).toBeInstanceOf(Text);
      expect(root.textContent).toBe('some text');
    });
    
    it('when before a tag', () => {
      const root = parseHTMLString('some text<hr/>');
      
      expect(root.children.length).toBe(1);
      expect(root.childNodes.length).toBe(2);
      expect(root.childNodes[0]).toBeInstanceOf(Text);
      expect(root.textContent).toBe('some text');
    });
  });
  
  describe('should handle attributes', () => {
    it('when special', () => {
      const root = parseHTMLString('<p #if="true"></p>');
      
      expect(root.toString()).toBe('<p #if="true"></p>');
    });
    
    it('when containing special html symbols as value', () => {
      const root = parseHTMLString('<p #if="20 > 5"></p>');
      
      expect(root.toString()).toBe('<p #if="20 > 5"></p>');
    });
    
    it('when repeated', () => {
      const root = parseHTMLString('<p #if="20 > 5" #repeat="3" id="sample"></p>');
      
      expect(root.toString()).toBe('<p #if="20 > 5" #repeat="3" id="sample"></p>');
    });
    
    it('when has empty or no value', () => {
      const root = parseHTMLString('<a href="" download></a>');
      
      expect(root.toString()).toBe('<a href download></a>');
    });
  });
  
})
