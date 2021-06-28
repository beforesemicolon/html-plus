const {transform} = require('./../transform');

describe('Fragment Attribute', () => {
  it('should render children content only', () => {
    const str = '<div #fragment><b>child text</b></div>'
    
    expect(transform(str)).toEqual('<b>child text</b>');
  });
  
  it('should render empty if no children', () => {
    const str = '<div #fragment></div>'
    
    expect(transform(str)).toEqual('');
  });
  
  describe('should work with other attributes', () => {
    it('repeat', () => {
      expect(transform('<b #fragment #repeat="3">{$item}</b>')).toEqual('123');
    });
    
    it('attr', () => {
      expect(transform('<b #attr="class, cls, true" #fragment>item</b>')).toEqual('item');
    });
    
    it('if', () => {
      expect(transform('<b #if="true" #fragment>item</b>')).toEqual('item');
    });
    
    it('ignore', () => {
      expect(transform('<b #ignore #fragment>{item}</b>')).toEqual('<b>{item}</b>');
    });
  });
});