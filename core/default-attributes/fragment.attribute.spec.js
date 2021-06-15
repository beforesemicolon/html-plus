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
});