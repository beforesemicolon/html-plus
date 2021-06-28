const {transform} = require('./../transform');

describe('Fragment Tag', () => {
  it('should render children content only', () => {
    const str = '<fragment><b>child text</b></fragment>'
    
    expect(transform(str)).toEqual('<b>child text</b>');
  });
  
  it('should render empty if no children', () => {
    const str = '<fragment></fragment>'
    
    expect(transform(str)).toEqual('');
  });
});