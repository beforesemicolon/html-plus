const {Fragment} = require('./fragment.tag');
const {transform} = require('./../transform');

describe('Fragment', () => {
  it('should render children content only', async () => {
    const str = '<fragment><b>child text</b></fragment>'
    const frag = new Fragment({children: () => ['child text']});
    
    await expect(frag.render()).resolves.toEqual('child text');
    await expect(transform(str)).resolves.toEqual('<b>child text</b>');
  });
  
  it('should render empty if no children', async () => {
    const str = '<fragment></fragment>'
    const frag = new Fragment({children: () => []});
    
    await expect(frag.render()).resolves.toEqual('');
    await expect(transform(str)).resolves.toEqual('');
  });
});