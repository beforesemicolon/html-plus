const {Selector} = require('./Selector');

describe('Selector', () => {
  it('should create using constructor', () => {
    expect(new Selector('global')).toEqual({
      "modifier": null,
      "name": null,
      "operator": null,
      "type": "global",
      "value": null
    })
    
    expect(new Selector('combinator', null, '>')).toEqual({
      "modifier": null,
      "name": null,
      "operator": null,
      "type": "combinator",
      "value": ">"
    })
    
    expect(new Selector('attribute', 'id', 'unique')).toEqual({
      "modifier": null,
      "name": "id",
      "operator": null,
      "type": "attribute",
      "value": "unique"
    })
    
    expect(new Selector('attribute', 'class', 'item', '^')).toEqual({
      "modifier": null,
      "name": "class",
      "operator": "^",
      "type": "attribute",
      "value": "item"
    })
    
    expect(new Selector('attribute', 'href', '/path', '$', 's')).toEqual({
      "modifier": "s",
      "name": "href",
      "operator": "$",
      "type": "attribute",
      "value": "/path"
    })
  });
  
  it('should throw if missing or invalid type', () => {
    expect(() => new Selector()).toThrowError('Invalid or missing selector type.')
    expect(() => new Selector('car')).toThrowError('Invalid or missing selector type.')
  });
  
  describe('should create with static method', () => {
    it('global', () => {
      expect(Selector.global()).toEqual({
        "modifier": null,
        "name": null,
        "operator": null,
        "type": "global",
        "value": "*"
      })
    });
    
    it('tag', () => {
      expect(Selector.tag('article')).toEqual({
        "modifier": null,
        "name": "article",
        "operator": null,
        "type": "tag",
        "value": null
      })
    });
    
    it('class', () => {
      expect(Selector.class('item')).toEqual({
        "modifier": null,
        "name": "class",
        "operator": "~",
        "type": "attribute",
        "value": "item"
      })
    });
  
    it('id', () => {
      expect(Selector.id('unique')).toEqual({
        "modifier": null,
        "name": "id",
        "operator": null,
        "type": "attribute",
        "value": "unique"
      })
    });
    
    it('attribute', () => {
      expect(Selector.attribute('not', Selector.id('one'))).toEqual({
        "modifier": null,
        "name": "not",
        "operator": null,
        "type": "attribute",
        "value": {
          "modifier": null,
          "name": "id",
          "operator": null,
          "type": "attribute",
          "value": "one"
        }
      })
    });
    
    it('pseudoClass', () => {
      expect(Selector.pseudoClass('nth-of-type', '3')).toEqual({
        "modifier": null,
        "name": "nth-of-type",
        "operator": null,
        "type": "pseudo-class",
        "value": "3"
      })
    });
    
    it('combinator', () => {
      expect(Selector.combinator('+')).toEqual({
        "modifier": null,
        "name": null,
        "operator": null,
        "type": "combinator",
        "value": "+"
      })
    });
  });
  
  describe('should convert to string', () => {
    it('global', () => {
      expect(Selector.global().toString()).toEqual('*')
    });
  
    it('tag', () => {
      expect(Selector.tag('div').toString()).toEqual('div')
    });
  
    it('class', () => {
      expect(Selector.class('item').toString()).toEqual('.item')
    });
  
    it('id', () => {
      expect(Selector.id('unique').toString()).toEqual('#unique')
    });
  
    it('attribute', () => {
      expect(Selector.attribute('href', '/path/simple').toString()).toEqual('[href="/path/simple"]')
      expect(Selector.attribute('href', '/path/simple', '$').toString()).toEqual('[href$="/path/simple"]')
      expect(Selector.attribute('href', '/path/simple', '$', 'i').toString()).toEqual('[href$="/path/simple"i]')
    });
  
    it('pseudoClass', () => {
      expect(Selector.pseudoClass('not', Selector.id('one')).toString()).toEqual(':not(#one)')
      expect(Selector.pseudoClass('disabled').toString()).toEqual(':disabled')
      expect(Selector.pseudoClass('last-child').toString()).toEqual(':last-child')
      expect(Selector.pseudoClass('nth-child', '3').toString()).toEqual(':nth-child(3)')
    });
  
    it('combinator', () => {
      expect(Selector.combinator(' ').toString()).toEqual(' ')
      expect(Selector.combinator('+').toString()).toEqual(' + ')
    });
  
    it('composed', () => {
      expect([
        Selector.tag('article'),
        Selector.class('blog-post'),
        Selector.combinator(' '),
        Selector.global(),
        Selector.combinator('>'),
        Selector.pseudoClass('not', Selector.tag('p')),
      ].join('')).toEqual('article.blog-post * > :not(p)')
    });
  });
});
