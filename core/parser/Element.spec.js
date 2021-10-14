const {Element} = require('./Element');
const {parse} = require('.');
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
      const ul = parse('<ul>' +
        '<li>item 1</li>' +
        'some before text <li>item 2</li> some after text' +
        '<li>item 3</li>' +
        '</ul>').children[0];
      
      expect(ul.childNodes.length).toBe(5)
      expect(ul.children.length).toBe(3)
      expect(ul.children.toString()).toBe('<li>item 1</li>,<li>item 2</li>,<li>item 3</li>')
      expect(ul.firstElementChild.toString()).toBe('<li>item 1</li>')
      expect(ul.lastElementChild.toString()).toBe('<li>item 3</li>')
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
      ul = parse('<ul>' +
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
  
  describe('working with css selectors', () => {
    const node = parse(`<section class="block">
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
      </section>`);
    
    describe('querySelector', () => {
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
        expect(() => node.querySelector('[class="item sample"]')).toThrowError('Failed to execute \'querySelector\' on \'Element\': \'[class=\"item sample\"]\' is not a valid selector.')
        expect(() => node.querySelector(':not(.item:not(.special))')).toThrowError('Failed to execute \'querySelector\' on \'Element\': \':not(.item:not(.special))\' is not a valid selector.')
      });
    });
    
    describe('querySelectorAll', () => {
      it('should collect all li', () => {
        expect(node.querySelectorAll('li').map(n => n.attributes.toString())).toEqual([
          "class=\"item\" name=\"\"",
          "class=\"item\"",
          "class=\"item\"",
          "class=\"item\"",
          "class=\"item special-item\"",
          "",
          "class=\"last\""
        ])
      });
  
      it('should collect all ul', () => {
        expect(node.querySelectorAll('ul').map(n => n.attributes.toString())).toEqual([
          "class=\"list\"",
          "class=\"sub-menu\" id=\"more-menu\""
        ])
      });
  
      it('should collect all elements without a class', () => {
        expect(node.querySelectorAll(':not([class])').map(n => n.tagName)).toEqual([
          "h2",
          "span",
          "li"
        ])
      });
    })
  
    it('matches', () => {
      const div = new Element('div');
      const a = new Element('a');
      a.setAttribute('download');
      a.setAttribute('href', '/sample/path');
      a.setAttribute('class', 'link');
  
      div.appendChild(a);
      
      expect(a.matches('.link')).toBeTruthy();
      expect(a.matches('.link-super')).toBeFalsy();
      expect(a.matches('[download][href="/sample/path"]')).toBeTruthy();
      expect(a.matches('div > a.link')).toBeTruthy();
      expect(a.matches('section a.link')).toBeFalsy();
    });
  
    it('closest', () => {
      const lastLi = node.querySelector('.last');
      
      expect(lastLi.closest('.special-item').className).toBe('item special-item');
      expect(lastLi.closest('.list').className).toBe('list');
      expect(lastLi.closest('*:nth-child(2)').className).toBe('last');
      expect(lastLi.closest('.block:not(:last-child)')).toBeNull();
      expect(lastLi.closest('.block:not(:nth-child(3))')).not.toBeNull();
      expect(lastLi.closest('.main-title + *')).toBeNull();
    });
  })
  
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
