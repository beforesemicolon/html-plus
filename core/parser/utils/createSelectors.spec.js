const {createSelectors} = require("./createSelectors");

describe('createSelectors', () => {
  it('global selector', () => {
    expect(createSelectors('*')).toEqual([
      {
        "modifier": null,
        "name": null,
        "operator": null,
        "type": "global",
        "value": null
      }
    ])
  });
  
  it('tag name selector', () => {
    expect(createSelectors('section')).toEqual([
      {
        "modifier": null,
        "name": 'section',
        "operator": null,
        "type": "tag",
        "value": null
      }
    ])
  });
  
  describe('should throw error', () => {
    it('if starts with combinator symbol', () => {
      expect(() => createSelectors('+ section'))
        .toThrowError('Invalid selector string: It may not start with any combinator symbol.')
      expect(() => createSelectors('~ section'))
        .toThrowError('Invalid selector string: It may not start with any combinator symbol.')
      expect(() => createSelectors('> section'))
        .toThrowError('Invalid selector string: It may not start with any combinator symbol.')
    });
  
    it('if multiple combinator next to each other', () => {
      expect(() => createSelectors('body > + section'))
        .toThrowError('Invalid selector string: Must not contain nested combinator symbols.')
      expect(() => createSelectors('body > ~ section'))
        .toThrowError('Invalid selector string: Must not contain nested combinator symbols.')
      expect(() => createSelectors('body + > section'))
        .toThrowError('Invalid selector string: Must not contain nested combinator symbols.')
      expect(() => createSelectors('body + ~ section'))
        .toThrowError('Invalid selector string: Must not contain nested combinator symbols.')
      expect(() => createSelectors('body ~ > section'))
        .toThrowError('Invalid selector string: Must not contain nested combinator symbols.')
      expect(() => createSelectors('body ~ + section'))
        .toThrowError('Invalid selector string: Must not contain nested combinator symbols.')
    });
  });
  
  describe('attribute selectors', () => {
    it('id', () => {
      expect(createSelectors('#sample')).toEqual([
        {
          "modifier": null,
          "name": "id",
          "operator": null,
          "type": "attribute",
          "value": "sample"
        }
      ])
      expect(createSelectors('#')).toEqual([])
    });
  
    it('class', () => {
      expect(createSelectors('.sample')).toEqual([
        {
          "modifier": null,
          "name": "class",
          "operator": null,
          "type": "attribute",
          "value": "sample"
        }
      ])
      expect(createSelectors('.')).toEqual([])
    });
    
    it('attribute name', () => {
      expect(createSelectors('[href]')).toEqual([
        {
          "modifier": null,
          "name": "href",
          "operator": null,
          "type": "attribute",
          "value": null
        }
      ])
    });
  
    it('attribute name and modifier', () => {
      expect(createSelectors('[href i]')).toEqual([
        {
          "modifier": "i",
          "name": "href",
          "operator": null,
          "type": "attribute",
          "value": null
        }
      ])
    });
  
    it('attribute name value', () => {
      expect(createSelectors('[name="email"]')).toEqual([
        {
          "modifier": null,
          "name": "name",
          "operator": null,
          "type": "attribute",
          "value": "email"
        }
      ])
    });
  
    it('attribute name value with operator', () => {
      expect(createSelectors('[href^="/some/path"]')).toEqual([
        {
          "modifier": null,
          "name": "href",
          "operator": "^",
          "type": "attribute",
          "value": "/some/path"
        }
      ]);
    });
  
    it('attribute name value with modifier', () => {
      expect(createSelectors('[href="/some/path" i]')).toEqual([
        {
          "modifier": "i",
          "name": "href",
          "operator": null,
          "type": "attribute",
          "value": "/some/path"
        }
      ])
    });
  
    it('attribute name value with operator and modifier', () => {
      expect(createSelectors('[href$="/some/path" i]')).toEqual([
        {
          "modifier": "i",
          "name": "href",
          "operator": "$",
          "type": "attribute",
          "value": "/some/path"
        }
      ])
    });
  });
  
  describe('combinators', () => {
    it('next sibling', () => {
      expect(createSelectors(' + ')).toEqual([
        {
          "modifier": null,
          "name": null,
          "operator": null,
          "type": "combinator",
          "value": "+"
        }
      ])
    });
  
    it('adjacent siblings', () => {
      expect(createSelectors(' ~ ')).toEqual([
        {
          "modifier": null,
          "name": null,
          "operator": null,
          "type": "sibling",
          "value": "~"
        }
      ])
    });
  
    it('direct child', () => {
      expect(createSelectors(' > ')).toEqual([
        {
          "modifier": null,
          "name": null,
          "operator": null,
          "type": "descendent",
          "value": ">"
        }
      ])
    });
  
    it('descendents', () => {
      expect(createSelectors(' ')).toEqual([
        {
          "modifier": null,
          "name": null,
          "operator": null,
          "type": "descendent",
          "value": null
        }
      ])
    });
  });
  
  describe('pseudo-class selector', () => {
    it('disabled & enabled', () => {
      expect(createSelectors(':disabled')).toEqual([
        {
          "modifier": null,
          "name": 'disabled',
          "operator": null,
          "type": "pseudo-class",
          "value": null
        }
      ])
      expect(createSelectors(':enabled')).toEqual([
        {
          "modifier": null,
          "name": 'enabled',
          "operator": null,
          "type": "pseudo-class",
          "value": null
        }
      ])
    });
  
    it('blank & empty', () => {
      expect(createSelectors(':blank')).toEqual([
        {
          "modifier": null,
          "name": 'blank',
          "operator": null,
          "type": "pseudo-class",
          "value": null
        }
      ])
      expect(createSelectors(':empty')).toEqual([
        {
          "modifier": null,
          "name": 'empty',
          "operator": null,
          "type": "pseudo-class",
          "value": null
        }
      ])
    });
  
    it('optional & required', () => {
      expect(createSelectors(':optional')).toEqual([
        {
          "modifier": null,
          "name": 'optional',
          "operator": null,
          "type": "pseudo-class",
          "value": null
        }
      ])
      expect(createSelectors(':required')).toEqual([
        {
          "modifier": null,
          "name": 'required',
          "operator": null,
          "type": "pseudo-class",
          "value": null
        }
      ])
    });
  
    it('read-only & read-write', () => {
      expect(createSelectors(':read-only')).toEqual([
        {
          "modifier": null,
          "name": 'read-only',
          "operator": null,
          "type": "pseudo-class",
          "value": null
        }
      ])
      expect(createSelectors(':read-write')).toEqual([
        {
          "modifier": null,
          "name": 'read-write',
          "operator": null,
          "type": "pseudo-class",
          "value": null
        }
      ])
    });
  
    it('nth-child & first-child & last-child & only-child', () => {
      expect(createSelectors(':nth-child(2)')).toEqual([
        {
          "modifier": null,
          "name": 'nth-child',
          "operator": null,
          "type": "pseudo-class",
          "value": "2"
        }
      ])
      
      expect(createSelectors(':first-child')).toEqual([
        {
          "modifier": null,
          "name": 'first-child',
          "operator": null,
          "type": "pseudo-class",
          "value": null
        }
      ])
      expect(createSelectors(':last-child')).toEqual([
        {
          "modifier": null,
          "name": 'last-child',
          "operator": null,
          "type": "pseudo-class",
          "value": null
        }
      ])
      expect(createSelectors(':only-child')).toEqual([
        {
          "modifier": null,
          "name": 'only-child',
          "operator": null,
          "type": "pseudo-class",
          "value": null
        }
      ])
    });
  
    it('nth-of-type & nth-last-of-type & first-of-type & last-of-type & only-of-type', () => {
      expect(createSelectors(':nth-of-type(2n+1)')).toEqual([
        {
          "modifier": null,
          "name": 'nth-of-type',
          "operator": null,
          "type": "pseudo-class",
          "value": "2n+1"
        }
      ])
      expect(createSelectors(':nth-last-of-type(2n)')).toEqual([
        {
          "modifier": null,
          "name": 'nth-last-of-type',
          "operator": null,
          "type": "pseudo-class",
          "value": "2n"
        }
      ])
      expect(createSelectors(':first-of-type')).toEqual([
        {
          "modifier": null,
          "name": 'first-of-type',
          "operator": null,
          "type": "pseudo-class",
          "value": null
        }
      ])
      expect(createSelectors(':last-of-type')).toEqual([
        {
          "modifier": null,
          "name": 'last-of-type',
          "operator": null,
          "type": "pseudo-class",
          "value": null
        }
      ])
      expect(createSelectors(':only-of-type')).toEqual([
        {
          "modifier": null,
          "name": 'only-of-type',
          "operator": null,
          "type": "pseudo-class",
          "value": null
        }
      ])
    });
  });
  
  it('combined selectors', () => {
    [
      ['ul li + li:first-child', ["ul", " ", "li", "+", "li", "first-child"]],
      ['button:disabled > span:only-child', ["button", "disabled", ">", "span", "only-child"]],
      ['section#box h2', ["section", "box", " ", "h2"]],
      ['ul > li.item', ["ul", ">", "li", "item"]],
      ['*:disabled', [null, "disabled"]],
      ['*::after', []],
    ].forEach(([sel, result]) => {
      expect(createSelectors(sel).map(s => (s.value || s.name))).toEqual(result)
    })
  });
});
