const {transform} = require('../../transform');

describe('Attr Attribute', () => {
  it('should set no attribute if no name', async () => {
    const str = '<p #attr="">child text</p>'
  
    await expect(transform(str)).resolves.toEqual('<p>child text</p>');
  });
  
  describe('should set attribute if condition is truthy', () => {
    it('with no value', async () => {
      const str1 = '<p #attr="hidden, true">child text</p>';
      const str2 = '<button #attr="disabled, true">btn1</button>';
      const str3 = '<button #attr="disabled">btn2</button>';
  
      await expect(transform(str1)).resolves.toEqual('<p hidden>child text</p>');
      await expect(transform(str2)).resolves.toEqual('<button disabled>btn1</button>');
      await expect(transform(str3)).resolves.toEqual('<button>btn2</button>');
    });
    
    it('with value', async () => {
      const str1 = '<p #attr="id, paragraph, true">child text</p>';
      const str2 = '<button #attr="type, submit, true">child text</button>';
      const str3 = '<input #attr="type, email, true">';
  
      await expect(transform(str1)).resolves.toEqual('<p id="paragraph">child text</p>');
      await expect(transform(str2)).resolves.toEqual('<button type="submit">child text</button>');
      await expect(transform(str3)).resolves.toEqual('<input type="email"/>');
    });
  });
  
  it('should not set attribute condition is falsy', async () => {
    const str1 = '<p #attr="id, paragraph, false">child text</p>';
    const str2 = '<button #attr="type, submit, false">child text</button>';
    const str3 = '<input #attr="type, email, false">';
  
    await expect(transform(str1)).resolves.toEqual('<p>child text</p>');
    await expect(transform(str2)).resolves.toEqual('<button>child text</button>');
    await expect(transform(str3)).resolves.toEqual('<input/>');
  });
  
  it('should handle multiple attribute', async () => {
    const str1 = '<button #attr="type, submit, true; disabled, true">child text</button>';
    const str2 = '<input #attr="type, email, false; value, 12, true"/>';
  
    await expect(transform(str1)).resolves.toEqual('<button type="submit" disabled>child text</button>');
    await expect(transform(str2)).resolves.toEqual('<input value="12"/>');
  });
  
  describe('should handle compound attributes', () => {
    it('style', async () => {
      const str1 = '<button #attr="style, display:block;align: left, true">child text</button>';
      const str2 = '<button #attr="style, background: linear-gradient(90deg, #900, #000), true">child text</button>';
      const str3 = '<button #attr="style, background: linear-gradient(90deg, #900, #000), false">child text</button>';
      const str4 = '<button #attr="style, color: blue, false; style, background: blue, true">child text</button>';
  
      await expect(transform(str1)).resolves.toEqual('<button style="display:block;align: left">child text</button>');
      await expect(transform(str2)).resolves.toEqual('<button style="background: linear-gradient(90deg, #900, #000)">child text</button>');
      await expect(transform(str3)).resolves.toEqual('<button>child text</button>');
      await expect(transform(str4)).resolves.toEqual('<button style="background: blue">child text</button>');
    });
    
    it('class', async () => {
      const str1 = '<button #attr="class, current, true">child text</button>';
      const str2 = '<button #attr="class, target sample, true">child text</button>';
      const str3 = '<button #attr="class, active, false">child text</button>';
      const str4 = '<button #attr="class, current, false; class, active, true">child text</button>';
  
      await expect(transform(str1)).resolves.toEqual('<button class="current">child text</button>');
      await expect(transform(str2)).resolves.toEqual('<button class="target sample">child text</button>');
      await expect(transform(str3)).resolves.toEqual('<button>child text</button>');
      await expect(transform(str4)).resolves.toEqual('<button class="active">child text</button>');
    });
  });
  
  it('should override previously set attribute', async () => {
    const str1 = '<button class="current" #attr="class, active, true">child text</button>';
    const str2 = '<button style="color: blue" #attr="style, display:block;align: left, true">child text</button>';
    const str3 = '<button id="sample" #attr="id, btn, true">child text</button>';
  
    await expect(transform(str1)).resolves.toEqual('<button class="current active">child text</button>');
    await expect(transform(str2)).resolves.toEqual('<button style="color: blue; display:block;align: left">child text</button>');
    await expect(transform(str3)).resolves.toEqual('<button id="btn">child text</button>');
  });
  
  describe('should work with other attributes', () => {
    it('repeat', async () => {
      await expect(transform('<b #attr="class, cls, true" #repeat="3">{$item}</b>'))
        .resolves.toEqual('<b class="cls">1</b><b class="cls">2</b><b class="cls">3</b>');
    });
  
    it('fragment', async () => {
      await expect(transform('<b #attr="class, cls, true" #fragment>item</b>')).resolves.toEqual('item');
    });
  
    it('if', async () => {
      await expect(transform('<b #if="false" #attr="id, imp, true">item</b>')).resolves.toEqual('');
      await expect(transform('<b #if="true" #attr="id, imp, true">item</b>')).resolves.toEqual('<b id="imp">item</b>');
    });
    
    it('ignore', async () => {
      await expect(transform('<b #attr="class, cls, true" #ignore>{item}</b>'))
        .resolves.toEqual('<b class="cls">{item}</b>');
    });
  });
});






