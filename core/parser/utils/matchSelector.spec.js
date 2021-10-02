const matchSelector = require('./matchSelector');
const {Element, parseHTMLString} = require('../Element');
const {Selector} = require("../Selector");

describe('MatchSelector Single', () => {
  it('should handle global selector', () => {
    const selector = Selector.global()
    const node1 = new Element('section');
    const node2 = new Element('h2');
    
    expect(matchSelector.single(node1, selector)).toBeTruthy();
    expect(matchSelector.single(node2, selector)).toBeTruthy();
    expect(matchSelector.single(null, selector)).toBeFalsy();
  });
  
  it('should handle tag selector', () => {
    expect(matchSelector.single(new Element('section'), Selector.tag('section'))).toBeTruthy();
    expect(matchSelector.single(new Element('section'), Selector.tag('div'))).toBeFalsy();
  });
  
  describe('should handle attribute selector', () => {
    let node;
    
    beforeEach(() => {
      node = new Element('div');
    })
    
    it('id', () => {
      const idSelector = Selector.id('sample');
      expect(matchSelector.single(node, idSelector)).toBeFalsy();
      
      node.id = 'sample';
      
      expect(matchSelector.single(node, idSelector)).toBeTruthy();
      expect(matchSelector.single(node, Selector.id('simple'))).toBeFalsy();
    });
    
    it('class', () => {
      const clsSelector = Selector.class('box');
      expect(matchSelector.single(node, clsSelector)).toBeFalsy();
      
      node.className = 'box';
      
      expect(matchSelector.single(node, clsSelector)).toBeTruthy();
      expect(matchSelector.single(node, Selector.class('red-box'))).toBeFalsy();
    });
    
    it('with attribute name only', () => {
      const clsSelector = Selector.attribute('class');
      
      expect(matchSelector.single(node, clsSelector)).toBeFalsy();
      
      node.className = '';
      
      expect(matchSelector.single(node, clsSelector)).toBeTruthy();
    });
    
    describe('with operator', () => {
      beforeEach(() => {
        node.className = 'simple-container box content-wrapper sm-4';
      })
      
      it('*', () => {
        const clsSelector = Selector.attribute('class', 'box');
        clsSelector.operator = '*'
        
        expect(matchSelector.single(node, clsSelector)).toBeTruthy();
        
        clsSelector.value = 'no-box';
        
        expect(matchSelector.single(node, clsSelector)).toBeFalsy();
      });
      
      it('^', () => {
        const clsSelector = Selector.attribute('class', 'box');
        clsSelector.operator = '^'
        
        expect(matchSelector.single(node, clsSelector)).toBeFalsy();
        
        clsSelector.value = 'simple';
        
        expect(matchSelector.single(node, clsSelector)).toBeTruthy();
        
        clsSelector.value = 'simp';
        
        expect(matchSelector.single(node, clsSelector)).toBeTruthy();
      });
      
      it('$', () => {
        const clsSelector = Selector.attribute('class', 'box');
        clsSelector.operator = '$'
        
        expect(matchSelector.single(node, clsSelector)).toBeFalsy();
        
        clsSelector.value = 'sm-4';
        
        expect(matchSelector.single(node, clsSelector)).toBeTruthy();
        
        clsSelector.value = '-4';
        
        expect(matchSelector.single(node, clsSelector)).toBeTruthy();
      });
      
      it('|', () => {
        const clsSelector = Selector.attribute('class', 'box');
        clsSelector.operator = '|'
        
        expect(matchSelector.single(node, clsSelector)).toBeFalsy();
        
        clsSelector.value = 'simple-container box content-wrapper sm-4';
        
        expect(matchSelector.single(node, clsSelector)).toBeTruthy();
        
        clsSelector.value = 'simple';
        
        expect(matchSelector.single(node, clsSelector)).toBeTruthy();
      });
      
      it('~', () => {
        const clsSelector = Selector.attribute('class', 'box');
        clsSelector.operator = '~'
        
        expect(matchSelector.single(node, clsSelector)).toBeTruthy();
        
        clsSelector.value = 'simple';
        
        expect(matchSelector.single(node, clsSelector)).toBeFalsy();
        
        clsSelector.value = 'simple-container';
        
        expect(matchSelector.single(node, clsSelector)).toBeTruthy();
      });
    });
  });
  
  describe('should handle pseudo-class selector', () => {
    it('root', () => {
      const rootSelector = Selector.pseudoClass('root');
      const node = parseHTMLString('<h2>some title</h2>');
      
      expect(matchSelector.single(node, rootSelector)).toBeTruthy();
      expect(matchSelector.single(node.children[0], rootSelector)).toBeFalsy();
    });
    
    it('not', () => {
      const notSelector = Selector.pseudoClass('not', '');
      const node = new Element('section');
      
      expect(() => matchSelector.single(node, notSelector))
        .toThrowError('Invalid selector to match');

      notSelector.value = Selector.class('section');

      expect(matchSelector.single(node, notSelector)).toBeTruthy();

      node.className = 'section';

      expect(matchSelector.single(node, notSelector)).toBeFalsy();
      
      const parent = new Element('div');
      parent.appendChild(node);
      
      notSelector.value = [
        [Selector.global()],
        [Selector.combinator('>')],
        [Selector.tag('section')],
      ];
      
      expect(matchSelector.single(node, notSelector)).toBeFalsy();
    });
    
    it('disabled', () => {
      const disabledSelector = Selector.pseudoClass('disabled');
      const node = new Element('button');
      
      expect(matchSelector.single(node, disabledSelector)).toBeFalsy();
      
      node.setAttribute('disabled');
      
      expect(matchSelector.single(node, disabledSelector)).toBeTruthy();
    });
    
    it('enabled', () => {
      const enabledSelector = Selector.pseudoClass('enabled');
      const node = new Element('button');
      
      expect(matchSelector.single(node, enabledSelector)).toBeTruthy();
      
      node.setAttribute('disabled');
      
      expect(matchSelector.single(node, enabledSelector)).toBeFalsy();
    });
    
    it('checked', () => {
      const checkedSelector = Selector.pseudoClass('checked');
      const node = new Element('button');
      
      expect(matchSelector.single(node, checkedSelector)).toBeFalsy();
      
      node.setAttribute('checked');
      
      expect(matchSelector.single(node, checkedSelector)).toBeTruthy();
    });
    
    it('read-only', () => {
      const readOnlySelector = Selector.pseudoClass('read-only');
      const inputNode = new Element('input');
      const divNode = new Element('div');
      
      expect(matchSelector.single(divNode, readOnlySelector)).toBeTruthy();
      expect(matchSelector.single(inputNode, readOnlySelector)).toBeFalsy();
      
      inputNode.setAttribute('readonly');
      
      expect(matchSelector.single(inputNode, readOnlySelector)).toBeTruthy();
      
      divNode.setAttribute('contenteditable');
      
      expect(matchSelector.single(divNode, readOnlySelector)).toBeFalsy();
    });
    
    it('read-write', () => {
      const readWriteSelector = Selector.pseudoClass('read-write');
      const inputNode = new Element('input');
      const divNode = new Element('div');
      
      expect(matchSelector.single(divNode, readWriteSelector)).toBeFalsy();
      expect(matchSelector.single(inputNode, readWriteSelector)).toBeTruthy();
      
      inputNode.setAttribute('readonly');
      
      expect(matchSelector.single(inputNode, readWriteSelector)).toBeFalsy();
      
      divNode.setAttribute('contenteditable');
      
      expect(matchSelector.single(divNode, readWriteSelector)).toBeTruthy();
    });
    
    it('optional', () => {
      const optionalSelector = Selector.pseudoClass('optional');
      const inputNode = new Element('input');
      
      expect(matchSelector.single(inputNode, optionalSelector)).toBeTruthy();
      
      inputNode.setAttribute('required');
      
      expect(matchSelector.single(inputNode, optionalSelector)).toBeFalsy();
    });
    
    it('empty', () => {
      const emptySelector = Selector.pseudoClass('empty');
      const divNode = new Element('div');
      
      expect(matchSelector.single(new Element('meta'), emptySelector)).toBeTruthy();
      expect(matchSelector.single(divNode, emptySelector)).toBeTruthy();
      
      divNode.innerHTML = 'text';
      
      expect(matchSelector.single(divNode, emptySelector)).toBeFalsy();
      
      divNode.innerHTML = '<!-- comment -->';
      
      expect(matchSelector.single(divNode, emptySelector)).toBeFalsy();
      
      divNode.innerHTML = '';
      divNode.appendChild(new Element('span'));
      
      expect(matchSelector.single(divNode, emptySelector)).toBeFalsy();
    });
    
    describe('child && type', () => {
      let ul;
      
      beforeEach(() => {
        ul = parseHTMLString('<ul>' +
          '<li>item-1</li>' +
          '<li>item-2</li>' +
          '<li>item-3</li>' +
          '<li>item-4</li>' +
          '<li>item-5</li>' +
          '</ul>')
          .children[0];
      })
      
      it('first-child', () => {
        const firstChildSelector = Selector.pseudoClass('first-child');
        
        expect(matchSelector.single(ul.children[0], firstChildSelector)).toBeTruthy();
        expect(matchSelector.single(ul.children[1], firstChildSelector)).toBeFalsy();
        expect(matchSelector.single(ul.children[2], firstChildSelector)).toBeFalsy();
        expect(matchSelector.single(ul.children[3], firstChildSelector)).toBeFalsy();
        expect(matchSelector.single(ul.children[4], firstChildSelector)).toBeFalsy();
      });
      
      it('last-child', () => {
        const lastChildSelector = Selector.pseudoClass('last-child');
        
        expect(matchSelector.single(ul.children[0], lastChildSelector)).toBeFalsy();
        expect(matchSelector.single(ul.children[1], lastChildSelector)).toBeFalsy();
        expect(matchSelector.single(ul.children[2], lastChildSelector)).toBeFalsy();
        expect(matchSelector.single(ul.children[3], lastChildSelector)).toBeFalsy();
        expect(matchSelector.single(ul.children[4], lastChildSelector)).toBeTruthy();
      });
      
      it('only-child', () => {
        const onlyChildSelector = Selector.pseudoClass('only-child');
        
        expect(matchSelector.single(ul.children[0], onlyChildSelector)).toBeFalsy();
        expect(matchSelector.single(ul.children[1], onlyChildSelector)).toBeFalsy();
        expect(matchSelector.single(ul.children[2], onlyChildSelector)).toBeFalsy();
        expect(matchSelector.single(ul.children[3], onlyChildSelector)).toBeFalsy();
        expect(matchSelector.single(ul.children[4], onlyChildSelector)).toBeFalsy();
        
        const divEl = new Element('div');
        
        divEl.appendChild(new Element('p'));
        
        expect(matchSelector.single(divEl.children[0], onlyChildSelector)).toBeTruthy();
      });
      
      it('first-of-type', () => {
        const firstOfTypeSelector = Selector.pseudoClass('first-of-type');
        
        expect(matchSelector.single(ul.children[0], firstOfTypeSelector)).toBeTruthy();
        expect(matchSelector.single(ul.children[1], firstOfTypeSelector)).toBeFalsy();
        expect(matchSelector.single(ul.children[2], firstOfTypeSelector)).toBeFalsy();
        expect(matchSelector.single(ul.children[3], firstOfTypeSelector)).toBeFalsy();
        expect(matchSelector.single(ul.children[4], firstOfTypeSelector)).toBeFalsy();
        
        expect(matchSelector.single(ul, firstOfTypeSelector)).toBeTruthy();
        
        let selectorType = [Selector.pseudoClass('nth-child', '2')];
        
        expect(matchSelector.single(ul.children[0], firstOfTypeSelector, selectorType)).toBeFalsy();
        expect(matchSelector.single(ul.children[1], firstOfTypeSelector, selectorType)).toBeTruthy();
        expect(matchSelector.single(ul.children[2], firstOfTypeSelector, selectorType)).toBeFalsy();
        expect(matchSelector.single(ul.children[3], firstOfTypeSelector, selectorType)).toBeFalsy();
        expect(matchSelector.single(ul.children[4], firstOfTypeSelector, selectorType)).toBeFalsy();
        
        selectorType = [Selector.tag('li')];
        
        expect(matchSelector.single(ul.children[0], firstOfTypeSelector, selectorType)).toBeTruthy();
        expect(matchSelector.single(ul.children[1], firstOfTypeSelector, selectorType)).toBeFalsy();
        expect(matchSelector.single(ul.children[2], firstOfTypeSelector, selectorType)).toBeFalsy();
        expect(matchSelector.single(ul.children[3], firstOfTypeSelector, selectorType)).toBeFalsy();
        expect(matchSelector.single(ul.children[4], firstOfTypeSelector, selectorType)).toBeFalsy();
        
        ul = parseHTMLString('<ul>' +
          '<li>item-1</li>' +
          '<li>item-2</li>' +
          '<li class="special-item">item-3</li>' +
          '<li class="special-item">item-4</li>' +
          '<li>item-5</li>' +
          '</ul>')
          .children[0];
        
        selectorType = [Selector.tag('li'), Selector.class('special-item')];
        
        expect(matchSelector.single(ul.children[0], firstOfTypeSelector, selectorType)).toBeFalsy();
        expect(matchSelector.single(ul.children[1], firstOfTypeSelector, selectorType)).toBeFalsy();
        expect(matchSelector.single(ul.children[2], firstOfTypeSelector, selectorType)).toBeTruthy();
        expect(matchSelector.single(ul.children[3], firstOfTypeSelector, selectorType)).toBeFalsy();
        expect(matchSelector.single(ul.children[4], firstOfTypeSelector, selectorType)).toBeFalsy();
      });
      
      it('last-of-type', () => {
        const lastOfTypeSelector = Selector.pseudoClass('last-of-type');
        
        expect(matchSelector.single(ul.children[0], lastOfTypeSelector)).toBeFalsy();
        expect(matchSelector.single(ul.children[1], lastOfTypeSelector)).toBeFalsy();
        expect(matchSelector.single(ul.children[2], lastOfTypeSelector)).toBeFalsy();
        expect(matchSelector.single(ul.children[3], lastOfTypeSelector)).toBeFalsy();
        expect(matchSelector.single(ul.children[4], lastOfTypeSelector)).toBeTruthy();
        
        expect(matchSelector.single(ul, lastOfTypeSelector)).toBeTruthy();
        
        let selectorType = [Selector.pseudoClass('nth-child', '2')];
        
        expect(matchSelector.single(ul.children[0], lastOfTypeSelector, selectorType)).toBeFalsy();
        expect(matchSelector.single(ul.children[1], lastOfTypeSelector, selectorType)).toBeTruthy();
        expect(matchSelector.single(ul.children[2], lastOfTypeSelector, selectorType)).toBeFalsy();
        expect(matchSelector.single(ul.children[3], lastOfTypeSelector, selectorType)).toBeFalsy();
        expect(matchSelector.single(ul.children[4], lastOfTypeSelector, selectorType)).toBeFalsy();
        
        selectorType = [Selector.tag('li')];
        
        expect(matchSelector.single(ul.children[0], lastOfTypeSelector, selectorType)).toBeFalsy();
        expect(matchSelector.single(ul.children[1], lastOfTypeSelector, selectorType)).toBeFalsy();
        expect(matchSelector.single(ul.children[2], lastOfTypeSelector, selectorType)).toBeFalsy();
        expect(matchSelector.single(ul.children[3], lastOfTypeSelector, selectorType)).toBeFalsy();
        expect(matchSelector.single(ul.children[4], lastOfTypeSelector, selectorType)).toBeTruthy();
        
        ul = parseHTMLString('<ul>' +
          '<li>item-1</li>' +
          '<li>item-2</li>' +
          '<li class="special-item">item-3</li>' +
          '<li class="special-item">item-4</li>' +
          '<li>item-5</li>' +
          '</ul>')
          .children[0];
        
        selectorType = [Selector.tag('li'), Selector.class('special-item')];
        
        expect(matchSelector.single(ul.children[0], lastOfTypeSelector, selectorType)).toBeFalsy();
        expect(matchSelector.single(ul.children[1], lastOfTypeSelector, selectorType)).toBeFalsy();
        expect(matchSelector.single(ul.children[2], lastOfTypeSelector, selectorType)).toBeFalsy();
        expect(matchSelector.single(ul.children[3], lastOfTypeSelector, selectorType)).toBeTruthy();
        expect(matchSelector.single(ul.children[4], lastOfTypeSelector, selectorType)).toBeFalsy();
      });
      
      it('only-of-type', () => {
        const onlyOfTypeSelector = Selector.pseudoClass('only-of-type');
        
        expect(matchSelector.single(ul.children[0], onlyOfTypeSelector)).toBeFalsy();
        expect(matchSelector.single(ul.children[1], onlyOfTypeSelector)).toBeFalsy();
        expect(matchSelector.single(ul.children[2], onlyOfTypeSelector)).toBeFalsy();
        expect(matchSelector.single(ul.children[3], onlyOfTypeSelector)).toBeFalsy();
        expect(matchSelector.single(ul.children[4], onlyOfTypeSelector)).toBeFalsy();
        
        expect(matchSelector.single(ul, onlyOfTypeSelector)).toBeTruthy();
        
        let selectorType = [Selector.pseudoClass('nth-child', '2')];
        
        expect(matchSelector.single(ul.children[0], onlyOfTypeSelector, selectorType)).toBeFalsy();
        expect(matchSelector.single(ul.children[1], onlyOfTypeSelector, selectorType)).toBeTruthy();
        expect(matchSelector.single(ul.children[2], onlyOfTypeSelector, selectorType)).toBeFalsy();
        expect(matchSelector.single(ul.children[3], onlyOfTypeSelector, selectorType)).toBeFalsy();
        expect(matchSelector.single(ul.children[4], onlyOfTypeSelector, selectorType)).toBeFalsy();
        
        selectorType = [Selector.tag('li')];
        
        expect(matchSelector.single(ul.children[0], onlyOfTypeSelector, selectorType)).toBeFalsy();
        expect(matchSelector.single(ul.children[1], onlyOfTypeSelector, selectorType)).toBeFalsy();
        expect(matchSelector.single(ul.children[2], onlyOfTypeSelector, selectorType)).toBeFalsy();
        expect(matchSelector.single(ul.children[3], onlyOfTypeSelector, selectorType)).toBeFalsy();
        expect(matchSelector.single(ul.children[4], onlyOfTypeSelector, selectorType)).toBeFalsy();
        
        ul = parseHTMLString('<ul>' +
          '<li>item-1</li>' +
          '<li>item-2</li>' +
          '<li>item-3</li>' +
          '<li class="special-item">item-4</li>' +
          '<li>item-5</li>' +
          '</ul>')
          .children[0];
        
        selectorType = [Selector.tag('li'), Selector.class('special-item')];
        
        expect(matchSelector.single(ul.children[0], onlyOfTypeSelector, selectorType)).toBeFalsy();
        expect(matchSelector.single(ul.children[1], onlyOfTypeSelector, selectorType)).toBeFalsy();
        expect(matchSelector.single(ul.children[2], onlyOfTypeSelector, selectorType)).toBeFalsy();
        expect(matchSelector.single(ul.children[3], onlyOfTypeSelector, selectorType)).toBeTruthy();
        expect(matchSelector.single(ul.children[4], onlyOfTypeSelector, selectorType)).toBeFalsy();
      });
      
      it('type mixed', () => {
        const firstOfTypeSelector = Selector.pseudoClass('first-of-type');
        const lastOfTypeSelector = Selector.pseudoClass('last-of-type');
        const onlyOfTypeSelector = Selector.pseudoClass('only-of-type');
        const notSelector = Selector.pseudoClass('not', firstOfTypeSelector);
        
        ul = parseHTMLString('<ul>' +
          '<li>item-1</li>' +
          '<li>item-2</li>' +
          '<li>item-3</li>' +
          '<li class="special-item">item-4</li>' +
          '<li>item-5</li>' +
          '</ul>')
          .children[0];
        
        expect(matchSelector.single(ul, firstOfTypeSelector,
          [lastOfTypeSelector, onlyOfTypeSelector])).toBeTruthy();
        expect(matchSelector.single(ul.children[3], firstOfTypeSelector,
          [Selector.class('special-item'), lastOfTypeSelector, onlyOfTypeSelector])).toBeTruthy();
        expect(matchSelector.single(ul.children[1], notSelector)).toBeTruthy();
      });
      
      describe('nth', () => {
        it('last-child', () => {
          const nthLastChildSelector = Selector.pseudoClass('nth-last-child', '1');
          
          expect(matchSelector.single(ul.children[0], nthLastChildSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[1], nthLastChildSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[2], nthLastChildSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[3], nthLastChildSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[4], nthLastChildSelector)).toBeTruthy();
          
          nthLastChildSelector.value = '2';
          
          expect(matchSelector.single(ul.children[0], nthLastChildSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[1], nthLastChildSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[2], nthLastChildSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[3], nthLastChildSelector)).toBeTruthy();
          expect(matchSelector.single(ul.children[4], nthLastChildSelector)).toBeFalsy();
          
          nthLastChildSelector.value = 'odd';
          
          expect(matchSelector.single(ul.children[0], nthLastChildSelector)).toBeTruthy();
          expect(matchSelector.single(ul.children[1], nthLastChildSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[2], nthLastChildSelector)).toBeTruthy();
          expect(matchSelector.single(ul.children[3], nthLastChildSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[4], nthLastChildSelector)).toBeTruthy();
          
          nthLastChildSelector.value = 'even';
          
          expect(matchSelector.single(ul.children[0], nthLastChildSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[1], nthLastChildSelector)).toBeTruthy();
          expect(matchSelector.single(ul.children[2], nthLastChildSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[3], nthLastChildSelector)).toBeTruthy();
          expect(matchSelector.single(ul.children[4], nthLastChildSelector)).toBeFalsy();
          
          nthLastChildSelector.value = 'n';
          
          expect(matchSelector.single(ul.children[0], nthLastChildSelector)).toBeTruthy();
          expect(matchSelector.single(ul.children[1], nthLastChildSelector)).toBeTruthy();
          expect(matchSelector.single(ul.children[2], nthLastChildSelector)).toBeTruthy();
          expect(matchSelector.single(ul.children[3], nthLastChildSelector)).toBeTruthy();
          expect(matchSelector.single(ul.children[4], nthLastChildSelector)).toBeTruthy();
          
          nthLastChildSelector.value = '4n';
          
          expect(matchSelector.single(ul.children[0], nthLastChildSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[1], nthLastChildSelector)).toBeTruthy();
          expect(matchSelector.single(ul.children[2], nthLastChildSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[3], nthLastChildSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[4], nthLastChildSelector)).toBeFalsy();
          
          nthLastChildSelector.value = 'n+3';
          
          expect(matchSelector.single(ul.children[0], nthLastChildSelector)).toBeTruthy();
          expect(matchSelector.single(ul.children[1], nthLastChildSelector)).toBeTruthy();
          expect(matchSelector.single(ul.children[2], nthLastChildSelector)).toBeTruthy();
          expect(matchSelector.single(ul.children[3], nthLastChildSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[4], nthLastChildSelector)).toBeFalsy();
          
          nthLastChildSelector.value = '2n+3';
          
          expect(matchSelector.single(ul.children[0], nthLastChildSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[1], nthLastChildSelector)).toBeTruthy();
          expect(matchSelector.single(ul.children[2], nthLastChildSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[3], nthLastChildSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[4], nthLastChildSelector)).toBeFalsy();
          
          nthLastChildSelector.value = '-n+3';
          
          expect(matchSelector.single(ul.children[0], nthLastChildSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[1], nthLastChildSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[2], nthLastChildSelector)).toBeTruthy();
          expect(matchSelector.single(ul.children[3], nthLastChildSelector)).toBeTruthy();
          expect(matchSelector.single(ul.children[4], nthLastChildSelector)).toBeTruthy();
          
          nthLastChildSelector.value = '-2n+3';
          
          expect(matchSelector.single(ul.children[0], nthLastChildSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[1], nthLastChildSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[2], nthLastChildSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[3], nthLastChildSelector)).toBeTruthy();
          expect(matchSelector.single(ul.children[4], nthLastChildSelector)).toBeFalsy();
        });
        
        it('child', () => {
          const nthChildSelector = Selector.pseudoClass('nth-child', '1');
          
          expect(matchSelector.single(ul.children[0], nthChildSelector)).toBeTruthy();
          expect(matchSelector.single(ul.children[1], nthChildSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[2], nthChildSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[3], nthChildSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[4], nthChildSelector)).toBeFalsy();
          
          nthChildSelector.value = '2';
          
          expect(matchSelector.single(ul.children[0], nthChildSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[1], nthChildSelector)).toBeTruthy();
          expect(matchSelector.single(ul.children[2], nthChildSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[3], nthChildSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[4], nthChildSelector)).toBeFalsy();
          
          nthChildSelector.value = 'odd';
          
          expect(matchSelector.single(ul.children[0], nthChildSelector)).toBeTruthy();
          expect(matchSelector.single(ul.children[1], nthChildSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[2], nthChildSelector)).toBeTruthy();
          expect(matchSelector.single(ul.children[3], nthChildSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[4], nthChildSelector)).toBeTruthy();
          
          nthChildSelector.value = 'even';
          
          expect(matchSelector.single(ul.children[0], nthChildSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[1], nthChildSelector)).toBeTruthy();
          expect(matchSelector.single(ul.children[2], nthChildSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[3], nthChildSelector)).toBeTruthy();
          expect(matchSelector.single(ul.children[4], nthChildSelector)).toBeFalsy();
          
          nthChildSelector.value = 'n';
          
          expect(matchSelector.single(ul.children[0], nthChildSelector)).toBeTruthy();
          expect(matchSelector.single(ul.children[1], nthChildSelector)).toBeTruthy();
          expect(matchSelector.single(ul.children[2], nthChildSelector)).toBeTruthy();
          expect(matchSelector.single(ul.children[3], nthChildSelector)).toBeTruthy();
          expect(matchSelector.single(ul.children[4], nthChildSelector)).toBeTruthy();
          
          nthChildSelector.value = '4n';
          
          expect(matchSelector.single(ul.children[0], nthChildSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[1], nthChildSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[2], nthChildSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[3], nthChildSelector)).toBeTruthy();
          expect(matchSelector.single(ul.children[4], nthChildSelector)).toBeFalsy();
          
          nthChildSelector.value = 'n+3';
          
          expect(matchSelector.single(ul.children[0], nthChildSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[1], nthChildSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[2], nthChildSelector)).toBeTruthy();
          expect(matchSelector.single(ul.children[3], nthChildSelector)).toBeTruthy();
          expect(matchSelector.single(ul.children[4], nthChildSelector)).toBeTruthy();
          
          nthChildSelector.value = '2n+3';
          
          expect(matchSelector.single(ul.children[0], nthChildSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[1], nthChildSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[2], nthChildSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[3], nthChildSelector)).toBeTruthy();
          expect(matchSelector.single(ul.children[4], nthChildSelector)).toBeFalsy();
          
          nthChildSelector.value = '-n+3';
          
          expect(matchSelector.single(ul.children[0], nthChildSelector)).toBeTruthy();
          expect(matchSelector.single(ul.children[1], nthChildSelector)).toBeTruthy();
          expect(matchSelector.single(ul.children[2], nthChildSelector)).toBeTruthy();
          expect(matchSelector.single(ul.children[3], nthChildSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[4], nthChildSelector)).toBeFalsy();
          
          nthChildSelector.value = '-2n+3';
          
          expect(matchSelector.single(ul.children[0], nthChildSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[1], nthChildSelector)).toBeTruthy();
          expect(matchSelector.single(ul.children[2], nthChildSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[3], nthChildSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[4], nthChildSelector)).toBeFalsy();
        });
        
        it('of-type', () => {
          const nthOfTypeSelector = Selector.pseudoClass('nth-of-type', '1');
          
          expect(matchSelector.single(ul.children[0], nthOfTypeSelector)).toBeTruthy();
          expect(matchSelector.single(ul.children[1], nthOfTypeSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[2], nthOfTypeSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[3], nthOfTypeSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[4], nthOfTypeSelector)).toBeFalsy();
          
          nthOfTypeSelector.value = '2';
          
          expect(matchSelector.single(ul.children[0], nthOfTypeSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[1], nthOfTypeSelector)).toBeTruthy();
          expect(matchSelector.single(ul.children[2], nthOfTypeSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[3], nthOfTypeSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[4], nthOfTypeSelector)).toBeFalsy();
          
          nthOfTypeSelector.value = 'odd';
          
          expect(matchSelector.single(ul.children[0], nthOfTypeSelector)).toBeTruthy();
          expect(matchSelector.single(ul.children[1], nthOfTypeSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[2], nthOfTypeSelector)).toBeTruthy();
          expect(matchSelector.single(ul.children[3], nthOfTypeSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[4], nthOfTypeSelector)).toBeTruthy();
          
          nthOfTypeSelector.value = 'even';
          
          expect(matchSelector.single(ul.children[0], nthOfTypeSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[1], nthOfTypeSelector)).toBeTruthy();
          expect(matchSelector.single(ul.children[2], nthOfTypeSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[3], nthOfTypeSelector)).toBeTruthy();
          expect(matchSelector.single(ul.children[4], nthOfTypeSelector)).toBeFalsy();
          
          nthOfTypeSelector.value = 'n';
          
          expect(matchSelector.single(ul.children[0], nthOfTypeSelector)).toBeTruthy();
          expect(matchSelector.single(ul.children[1], nthOfTypeSelector)).toBeTruthy();
          expect(matchSelector.single(ul.children[2], nthOfTypeSelector)).toBeTruthy();
          expect(matchSelector.single(ul.children[3], nthOfTypeSelector)).toBeTruthy();
          expect(matchSelector.single(ul.children[4], nthOfTypeSelector)).toBeTruthy();
          
          nthOfTypeSelector.value = '4n';
          
          expect(matchSelector.single(ul.children[0], nthOfTypeSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[1], nthOfTypeSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[2], nthOfTypeSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[3], nthOfTypeSelector)).toBeTruthy();
          expect(matchSelector.single(ul.children[4], nthOfTypeSelector)).toBeFalsy();
          
          nthOfTypeSelector.value = 'n+3';
          
          expect(matchSelector.single(ul.children[0], nthOfTypeSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[1], nthOfTypeSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[2], nthOfTypeSelector)).toBeTruthy();
          expect(matchSelector.single(ul.children[3], nthOfTypeSelector)).toBeTruthy();
          expect(matchSelector.single(ul.children[4], nthOfTypeSelector)).toBeTruthy();
          
          nthOfTypeSelector.value = '2n+3';
          
          expect(matchSelector.single(ul.children[0], nthOfTypeSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[1], nthOfTypeSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[2], nthOfTypeSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[3], nthOfTypeSelector)).toBeTruthy();
          expect(matchSelector.single(ul.children[4], nthOfTypeSelector)).toBeFalsy();
          
          nthOfTypeSelector.value = '-n+3';
          
          expect(matchSelector.single(ul.children[0], nthOfTypeSelector)).toBeTruthy();
          expect(matchSelector.single(ul.children[1], nthOfTypeSelector)).toBeTruthy();
          expect(matchSelector.single(ul.children[2], nthOfTypeSelector)).toBeTruthy();
          expect(matchSelector.single(ul.children[3], nthOfTypeSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[4], nthOfTypeSelector)).toBeFalsy();
          
          nthOfTypeSelector.value = '-2n+3';
          
          expect(matchSelector.single(ul.children[0], nthOfTypeSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[1], nthOfTypeSelector)).toBeTruthy();
          expect(matchSelector.single(ul.children[2], nthOfTypeSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[3], nthOfTypeSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[4], nthOfTypeSelector)).toBeFalsy();
        });
        
        it('last-of-type', () => {
          const nthLastOfTypeSelector = Selector.pseudoClass('nth-last-of-type', '1');
          
          expect(matchSelector.single(ul.children[0], nthLastOfTypeSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[1], nthLastOfTypeSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[2], nthLastOfTypeSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[3], nthLastOfTypeSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[4], nthLastOfTypeSelector)).toBeTruthy();
          
          nthLastOfTypeSelector.value = '2';
          
          expect(matchSelector.single(ul.children[0], nthLastOfTypeSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[1], nthLastOfTypeSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[2], nthLastOfTypeSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[3], nthLastOfTypeSelector)).toBeTruthy();
          expect(matchSelector.single(ul.children[4], nthLastOfTypeSelector)).toBeFalsy();
          
          nthLastOfTypeSelector.value = 'odd';
          
          expect(matchSelector.single(ul.children[0], nthLastOfTypeSelector)).toBeTruthy();
          expect(matchSelector.single(ul.children[1], nthLastOfTypeSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[2], nthLastOfTypeSelector)).toBeTruthy();
          expect(matchSelector.single(ul.children[3], nthLastOfTypeSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[4], nthLastOfTypeSelector)).toBeTruthy();
          
          nthLastOfTypeSelector.value = 'even';
          
          expect(matchSelector.single(ul.children[0], nthLastOfTypeSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[1], nthLastOfTypeSelector)).toBeTruthy();
          expect(matchSelector.single(ul.children[2], nthLastOfTypeSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[3], nthLastOfTypeSelector)).toBeTruthy();
          expect(matchSelector.single(ul.children[4], nthLastOfTypeSelector)).toBeFalsy();
          
          nthLastOfTypeSelector.value = 'n';
          
          expect(matchSelector.single(ul.children[0], nthLastOfTypeSelector)).toBeTruthy();
          expect(matchSelector.single(ul.children[1], nthLastOfTypeSelector)).toBeTruthy();
          expect(matchSelector.single(ul.children[2], nthLastOfTypeSelector)).toBeTruthy();
          expect(matchSelector.single(ul.children[3], nthLastOfTypeSelector)).toBeTruthy();
          expect(matchSelector.single(ul.children[4], nthLastOfTypeSelector)).toBeTruthy();
          
          nthLastOfTypeSelector.value = '4n';
          
          expect(matchSelector.single(ul.children[0], nthLastOfTypeSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[1], nthLastOfTypeSelector)).toBeTruthy();
          expect(matchSelector.single(ul.children[2], nthLastOfTypeSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[3], nthLastOfTypeSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[4], nthLastOfTypeSelector)).toBeFalsy();
          
          nthLastOfTypeSelector.value = 'n+3';
          
          expect(matchSelector.single(ul.children[0], nthLastOfTypeSelector)).toBeTruthy();
          expect(matchSelector.single(ul.children[1], nthLastOfTypeSelector)).toBeTruthy();
          expect(matchSelector.single(ul.children[2], nthLastOfTypeSelector)).toBeTruthy();
          expect(matchSelector.single(ul.children[3], nthLastOfTypeSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[4], nthLastOfTypeSelector)).toBeFalsy();
          
          nthLastOfTypeSelector.value = '2n+3';
          
          expect(matchSelector.single(ul.children[0], nthLastOfTypeSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[1], nthLastOfTypeSelector)).toBeTruthy();
          expect(matchSelector.single(ul.children[2], nthLastOfTypeSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[3], nthLastOfTypeSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[4], nthLastOfTypeSelector)).toBeFalsy();
          
          nthLastOfTypeSelector.value = '-n+3';
          
          expect(matchSelector.single(ul.children[0], nthLastOfTypeSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[1], nthLastOfTypeSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[2], nthLastOfTypeSelector)).toBeTruthy();
          expect(matchSelector.single(ul.children[3], nthLastOfTypeSelector)).toBeTruthy();
          expect(matchSelector.single(ul.children[4], nthLastOfTypeSelector)).toBeTruthy();
          
          nthLastOfTypeSelector.value = '-2n+3';
          
          expect(matchSelector.single(ul.children[0], nthLastOfTypeSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[1], nthLastOfTypeSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[2], nthLastOfTypeSelector)).toBeFalsy();
          expect(matchSelector.single(ul.children[3], nthLastOfTypeSelector)).toBeTruthy();
          expect(matchSelector.single(ul.children[4], nthLastOfTypeSelector)).toBeFalsy();
        });
      });
    });
  });
  
  it('should return false if no selector is supported', () => {
    expect(matchSelector.single(new Element('section'), new Selector('x'))).toBeFalsy();
    expect(matchSelector.single(new Element('section'), new Selector('pseudo-element', 'after'))).toBeFalsy();
    expect(matchSelector.single(new Element('section'), new Selector('pseudo-class', 'hover'))).toBeFalsy();
  });
});

describe('MatchSelector List', () => {
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
  
  describe('should handle combinators', () => {
    const sectionNode = node.children[0];
    const anchor = sectionNode.lastElementChild;
    const listNode = sectionNode.children[1];
    const specialItem = listNode.lastElementChild;
    const lastLi = specialItem.lastElementChild.lastElementChild;
    
    it('descendent', () => {
      expect(matchSelector.list(lastLi, 2,[
        [Selector.class('sub-menu')],
        [Selector.combinator(' ')],
        [Selector.tag('li')],
      ], lastLi)).toBeTruthy()

      expect(matchSelector.list(lastLi, 2,[
        [Selector.class('special-item')],
        [Selector.combinator(' ')],
        [Selector.tag('li')],
      ], lastLi)).toBeTruthy()
    });
    
    it('direct child', () => {
      expect(matchSelector.list(specialItem, 2,[
        [Selector.tag('section')],
        [Selector.combinator('>')],
        [Selector.class('special-item')],
      ], specialItem)).toBeFalsy();
  
      expect(matchSelector.list(specialItem, 2,[
        [Selector.class('list')],
        [Selector.combinator('>')],
        [Selector.class('special-item')],
      ], specialItem)).toBeTruthy();
    });
    
    it('next sibling', () => {
      expect(matchSelector.list(anchor, 2,[
        [Selector.tag('ul')],
        [Selector.combinator('+')],
        [Selector.tag('a')],
      ], anchor)).toBeTruthy();
  
      expect(matchSelector.list(anchor, 2,[
        [Selector.tag('h2')],
        [Selector.combinator('+')],
        [Selector.tag('a')],
      ], anchor)).toBeFalsy();
    });
    
    it('siblings', () => {
      expect(matchSelector.list(anchor, 2,[
        [Selector.tag('h2')],
        [Selector.combinator('~')],
        [Selector.tag('a')],
      ], anchor)).toBeTruthy();
  
      expect(matchSelector.list(specialItem, 2,[
        [Selector.attribute('name', '')],
        [Selector.combinator('~')],
        [Selector.class('special-item')],
      ], specialItem)).toBeTruthy();
  
      expect(matchSelector.list(listNode, 2,[
        [Selector.tag('a')],
        [Selector.combinator('~')],
        [Selector.class('list')],
      ], listNode)).toBeFalsy();
    });
  });
})
