const {transform} = require('./../transform');

describe('Fragment Tag', () => {
  it('should render children content only', async () => {
    const str = '<fragment><b>child text</b></fragment>'
    
    await expect(transform(str)).resolves.toEqual('<b>child text</b>');
  });
  
  it('should render empty if no children', async () => {
    const str = '<fragment></fragment>'
    
    await expect(transform(str)).resolves.toEqual('');
  });
});