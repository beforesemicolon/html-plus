const {transform} = require('../../transform');

describe('Fragment Attribute', () => {
  it('should render children content only', async () => {
    const str = '<div #fragment><b>child text</b></div>'
    
    await expect(transform(str)).resolves.toEqual('<b>child text</b>');
  });
  
  it('should render empty if no children', async () => {
    const str = '<div #fragment></div>'
    
    await expect(transform(str)).resolves.toEqual('');
  });
  
  describe('should work with other attributes', () => {
    it('repeat', async () => {
      await expect(transform('<b #fragment #repeat="3">{$item}</b>')).resolves.toEqual('123');
    });
    
    it('attr', async () => {
      await expect(transform('<b #attr="class, cls, true" #fragment>item</b>')).resolves.toEqual('item');
    });
    
    it('if', async () => {
      await expect(transform('<b #if="true" #fragment>item</b>')).resolves.toEqual('item');
    });
    
    it('ignore', async () => {
      await expect(transform('<b #ignore #fragment>{item}</b>')).resolves.toEqual('<b>{item}</b>');
    });
  });
});
