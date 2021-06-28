const {transform} = require('./../transform');

describe('Attr Attribute', () => {
  it('should set no attribute if no name', () => {
    const str = '<p #attr="">child text</p>'
  
    expect(transform(str)).toEqual('<p>child text</p>');
  });
  
  describe('should set attribute if condition is truthy', () => {
    it('with no value', () => {
      const str1 = '<p #attr="hidden, true">child text</p>';
      const str2 = '<button #attr="disabled, true">btn1</button>';
      const str3 = '<button #attr="disabled">btn2</button>';
  
      expect(transform(str1)).toEqual('<p hidden>child text</p>');
      expect(transform(str2)).toEqual('<button disabled>btn1</button>');
      expect(transform(str3)).toEqual('<button>btn2</button>');
    });
    
    it('with value', () => {
      const str1 = '<p #attr="id, paragraph, true">child text</p>';
      const str2 = '<button #attr="type, submit, true">child text</button>';
      const str3 = '<input #attr="type, email, true">';
  
      expect(transform(str1)).toEqual('<p id="paragraph">child text</p>');
      expect(transform(str2)).toEqual('<button type="submit">child text</button>');
      expect(transform(str3)).toEqual('<input type="email"/>');
    });
  });
  
  it('should not set attribute condition is falsy', () => {
    const str1 = '<p #attr="id, paragraph, false">child text</p>';
    const str2 = '<button #attr="type, submit, false">child text</button>';
    const str3 = '<input #attr="type, email, false">';
  
    expect(transform(str1)).toEqual('<p>child text</p>');
    expect(transform(str2)).toEqual('<button>child text</button>');
    expect(transform(str3)).toEqual('<input/>');
  });
  
  it('should handle multiple attribute', () => {
    const str1 = '<button #attr="type, submit, true; disabled, true">child text</button>';
    const str2 = '<input #attr="type, email, false; value, 12, true"/>';
  
    expect(transform(str1)).toEqual('<button type="submit" disabled>child text</button>');
    expect(transform(str2)).toEqual('<input value="12"/>');
  });
  
  describe('should handle compound attributes', () => {
    it('style', () => {
      const str1 = '<button #attr="style, display:block;align: left, true">child text</button>';
      const str2 = '<button #attr="style, background: linear-gradient(90deg, #900, #000), true">child text</button>';
      const str3 = '<button #attr="style, background: linear-gradient(90deg, #900, #000), false">child text</button>';
      const str4 = '<button #attr="style, color: blue, false; style, background: blue, true">child text</button>';
  
      expect(transform(str1)).toEqual('<button style="display:block;align: left">child text</button>');
      expect(transform(str2)).toEqual('<button style="background: linear-gradient(90deg, #900, #000)">child text</button>');
      expect(transform(str3)).toEqual('<button>child text</button>');
      expect(transform(str4)).toEqual('<button style="background: blue">child text</button>');
    });
    
    it('class', () => {
      const str1 = '<button #attr="class, current, true">child text</button>';
      const str2 = '<button #attr="class, target sample, true">child text</button>';
      const str3 = '<button #attr="class, active, false">child text</button>';
      const str4 = '<button #attr="class, current, false; class, active, true">child text</button>';
  
      expect(transform(str1)).toEqual('<button class="current">child text</button>');
      expect(transform(str2)).toEqual('<button class="target sample">child text</button>');
      expect(transform(str3)).toEqual('<button>child text</button>');
      expect(transform(str4)).toEqual('<button class="active">child text</button>');
    });
  });
  
  it('should override previously set attribute', () => {
    const str1 = '<button class="current" #attr="class, active, true">child text</button>';
    const str2 = '<button style="color: blue" #attr="style, display:block;align: left, true">child text</button>';
    const str3 = '<button id="sample" #attr="id, btn, true">child text</button>';
  
    expect(transform(str1)).toEqual('<button class="current active">child text</button>');
    expect(transform(str2)).toEqual('<button style="color: blue; display:block;align: left">child text</button>');
    expect(transform(str3)).toEqual('<button id="btn">child text</button>');
  });
  
  describe('should work with other attributes', () => {
    it('repeat', () => {
      expect(transform('<b #attr="class, cls, true" #repeat="3">{$item}</b>'))
        .toEqual('<b class="cls">1</b><b class="cls">2</b><b class="cls">3</b>');
    });
  
    it('fragment', () => {
      expect(transform('<b #attr="class, cls, true" #fragment>item</b>')).toEqual('item');
    });
  
    it('if', () => {
      expect(transform('<b #if="false" #attr="id, imp, true">item</b>')).toEqual('');
      expect(transform('<b #if="true" #attr="id, imp, true">item</b>')).toEqual('<b id="imp">item</b>');
    });
    
    it('ignore', () => {
      expect(transform('<b #attr="class, cls, true" #ignore>{item}</b>'))
        .toEqual('<b class="cls">{item}</b>');
    });
  });
});






