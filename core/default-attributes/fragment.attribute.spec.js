const {transform} = require('./../transform');

describe('Fragment Attribute', () => {
  it('should render children content only', async () => {
    const str = '<div #fragment><b>child text</b></div>'
    
    await expect(transform(str)).resolves.toEqual('<b>child text</b>');
  });
  
  it('should render empty if no children', async () => {
    const str = '<div #fragment></div>'
    
    await expect(transform(str)).resolves.toEqual('');
  });
});