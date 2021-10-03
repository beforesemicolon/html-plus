const {createSelectors} = require("./createSelectors");

describe('createSelectors', () => {
  it('global selector', () => {
    expect(createSelectors('*')).toEqual(expect.arrayContaining([
      [
        {
          "modifier": null,
          "name": null,
          "operator": null,
          "type": "global",
          "value": "*"
        }
      ]
    ]))
  });
  
  it('tag name selector', () => {
    expect(createSelectors('section')).toEqual(expect.arrayContaining([
      [
        {
          "modifier": null,
          "name": 'section',
          "operator": null,
          "type": "tag",
          "value": null
        }
      ]
    ]))
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
  
    it('if ends with combinator symbol', () => {
      expect(() => createSelectors('section +'))
        .toThrowError('Invalid selector string: It may not end with any combinator symbol.')
      expect(() => createSelectors('section ~'))
        .toThrowError('Invalid selector string: It may not end with any combinator symbol.')
      expect(() => createSelectors('section >'))
        .toThrowError('Invalid selector string: It may not end with any combinator symbol.')
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
      expect(createSelectors('#sample')).toEqual(expect.arrayContaining([
        [
          {
            "modifier": null,
            "name": "id",
            "operator": null,
            "type": "attribute",
            "value": "sample"
          }
        ]
      ]))
      expect(createSelectors('#')).toEqual([])
    });
  
    it('class', () => {
      expect(createSelectors('.sample')).toEqual(expect.arrayContaining([
        [
          {
            "modifier": null,
            "name": "class",
            "operator": "~",
            "type": "attribute",
            "value": "sample"
          }
        ]
      ]))
      expect(createSelectors('.')).toEqual([])
    });
    
    it('attribute name', () => {
      expect(createSelectors('[href]')).toEqual(expect.arrayContaining([
        [
          {
            "modifier": null,
            "name": "href",
            "operator": null,
            "type": "attribute",
            "value": null
          }
        ]
      ]))
    });
  
    it('attribute name and modifier', () => {
      expect(createSelectors('[href i]')).toEqual(expect.arrayContaining([
        [
          {
            "modifier": "i",
            "name": "href",
            "operator": null,
            "type": "attribute",
            "value": null
          }
        ]
      ]))
    });
  
    it('attribute name value', () => {
      expect(createSelectors('[name="email"]')).toEqual(expect.arrayContaining([
        [
          {
            "modifier": null,
            "name": "name",
            "operator": null,
            "type": "attribute",
            "value": "email"
          }
        ]
      ]))
    });
  
    it('attribute name value with operator', () => {
      expect(createSelectors('[href^="/some/path"]')).toEqual(expect.arrayContaining([
        [
          {
            "modifier": null,
            "name": "href",
            "operator": "^",
            "type": "attribute",
            "value": "/some/path"
          }
        ]
      ]));
    });
  
    it('attribute name value with modifier', () => {
      expect(createSelectors('[href="/some/path" i]')).toEqual(expect.arrayContaining([
        [
          {
            "modifier": "i",
            "name": "href",
            "operator": null,
            "type": "attribute",
            "value": "/some/path"
          }
        ]
      ]))
    });
  
    it('attribute name value with operator and modifier', () => {
      expect(createSelectors('[href$="/some/path" i]')).toEqual(expect.arrayContaining([
        [
          {
            "modifier": "i",
            "name": "href",
            "operator": "$",
            "type": "attribute",
            "value": "/some/path"
          }
        ]
      ]))
    });
  });
  
  describe('combinators', () => {
    
    it('next sibling', () => {
      expect(createSelectors('div + p')).toEqual(expect.arrayContaining([
        [
          {
            "modifier": null,
            "name": null,
            "operator": null,
            "type": "combinator",
            "value": "+"
          }
        ],
      ]))
    });
  
    it('adjacent siblings', () => {
      expect(createSelectors('div ~ p')).toEqual(expect.arrayContaining([
        [
          {
            "modifier": null,
            "name": null,
            "operator": null,
            "type": "combinator",
            "value": "~"
          }
        ],
      ]))
    });
  
    it('direct child', () => {
      expect(createSelectors('div > p')).toEqual(expect.arrayContaining([
        [
          {
            "modifier": null,
            "name": null,
            "operator": null,
            "type": "combinator",
            "value": ">"
          }
        ]
      ]))
    });
  
    it('descendents', () => {
      expect(createSelectors('div p')).toEqual(expect.arrayContaining([
        [
          {
            "modifier": null,
            "name": null,
            "operator": null,
            "type": "combinator",
            "value": " "
          }
        ]
      ]))
    });
  });
  
  describe('pseudo-class selector', () => {
    it('disabled & enabled', () => {
      expect(createSelectors(':disabled')).toEqual(expect.arrayContaining([
        [
          {
            "modifier": null,
            "name": 'disabled',
            "operator": null,
            "type": "pseudo-class",
            "value": null
          }
        ]
      ]))
      expect(createSelectors(':enabled')).toEqual(expect.arrayContaining([
        [
          {
            "modifier": null,
            "name": 'enabled',
            "operator": null,
            "type": "pseudo-class",
            "value": null
          }
        ]
      ]))
    });
  
    it('empty', () => {
      expect(createSelectors(':empty')).toEqual(expect.arrayContaining([
        [
          {
            "modifier": null,
            "name": 'empty',
            "operator": null,
            "type": "pseudo-class",
            "value": null
          }
        ]
      ]))
    });
  
    it('optional & required', () => {
      expect(createSelectors(':optional')).toEqual(expect.arrayContaining([
        [
          {
            "modifier": null,
            "name": 'optional',
            "operator": null,
            "type": "pseudo-class",
            "value": null
          }
        ]
      ]))
      expect(createSelectors(':required')).toEqual(expect.arrayContaining([
        [
          {
            "modifier": null,
            "name": 'required',
            "operator": null,
            "type": "pseudo-class",
            "value": null
          }
        ]
      ]))
    });
  
    it('read-only & read-write', () => {
      expect(createSelectors(':read-only')).toEqual(expect.arrayContaining([
        [
          {
            "modifier": null,
            "name": 'read-only',
            "operator": null,
            "type": "pseudo-class",
            "value": null
          }
        ]
      ]))
      expect(createSelectors(':read-write')).toEqual(expect.arrayContaining([
        [
          {
            "modifier": null,
            "name": 'read-write',
            "operator": null,
            "type": "pseudo-class",
            "value": null
          }
        ]
      ]))
    });
  
    it('nth-child & first-child & last-child & only-child', () => {
      expect(createSelectors(':nth-child(2)')).toEqual(expect.arrayContaining([
        [
          {
            "modifier": null,
            "name": 'nth-child',
            "operator": null,
            "type": "pseudo-class",
            "value": "2"
          }
        ]
      ]))
      expect(createSelectors(':first-child')).toEqual(expect.arrayContaining([
        [
          {
            "modifier": null,
            "name": 'first-child',
            "operator": null,
            "type": "pseudo-class",
            "value": null
          }
        ]
      ]))
      expect(createSelectors(':last-child')).toEqual(expect.arrayContaining([
        [
          {
            "modifier": null,
            "name": 'last-child',
            "operator": null,
            "type": "pseudo-class",
            "value": null
          }
        ]
      ]))
      expect(createSelectors(':only-child')).toEqual(expect.arrayContaining([
        [
          {
            "modifier": null,
            "name": 'only-child',
            "operator": null,
            "type": "pseudo-class",
            "value": null
          }
        ]
      ]))
    });
  
    it('nth-of-type & nth-last-of-type & first-of-type & last-of-type & only-of-type', () => {
      expect(createSelectors(':nth-of-type(2n+1)')).toEqual(expect.arrayContaining([
        [
          {
            "modifier": null,
            "name": 'nth-of-type',
            "operator": null,
            "type": "pseudo-class",
            "value": "2n+1"
          }
        ]
      ]))
      expect(createSelectors(':nth-last-of-type(2n)')).toEqual(expect.arrayContaining([
        [
          {
            "modifier": null,
            "name": 'nth-last-of-type',
            "operator": null,
            "type": "pseudo-class",
            "value": "2n"
          }
        ]
      ]))
      expect(createSelectors(':first-of-type')).toEqual(expect.arrayContaining([
        [
          {
            "modifier": null,
            "name": 'first-of-type',
            "operator": null,
            "type": "pseudo-class",
            "value": null
          }
        ]
      ]))
      expect(createSelectors(':last-of-type')).toEqual(expect.arrayContaining([
        [
          {
            "modifier": null,
            "name": 'last-of-type',
            "operator": null,
            "type": "pseudo-class",
            "value": null
          }
        ]
      ]))
      expect(createSelectors(':only-of-type')).toEqual(expect.arrayContaining([
        [
          {
            "modifier": null,
            "name": 'only-of-type',
            "operator": null,
            "type": "pseudo-class",
            "value": null
          }
        ]
      ]))
    });
  
    it('not', () => {
      expect(createSelectors(':not(.box.sample)')).toEqual(expect.arrayContaining([
        [
          {
            "modifier": null,
            "name": "not",
            "operator": null,
            "type": "pseudo-class",
            "value": [
              [
                {
                  "modifier": null,
                  "name": "class",
                  "operator": "~",
                  "type": "attribute",
                  "value": "box"
                },
                {
                  "modifier": null,
                  "name": "class",
                  "operator": "~",
                  "type": "attribute",
                  "value": "sample"
                }
              ]
            ]
          }
        ]
      ]))
    });
  });
  
  it('combined selectors', () => {
    [
      ['ul li + li:first-child', ["ul", " ", "li", "+", "li", "first-child"]],
      ['button:disabled > span:only-child', ["button", "disabled", ">", "span", "only-child"]],
      ['section#box h2', ["section", "box", " ", "h2"]],
      ['ul > li.item', ["ul", ">", "li", "item"]],
      ['*:disabled', ['*', "disabled"]],
      ['*::after', []],
    ].forEach(([sel, result]) => {
      const selector = createSelectors(sel).flat();
      expect(selector.map(s => (s.value || s.name))).toEqual(result)
    })
  });
});
