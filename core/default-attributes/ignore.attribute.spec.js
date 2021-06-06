const {transform} = require('./../transform');

describe('Ignore Attribute', () => {
  it('should not bind data', async () => {
    const str = '<div #ignore><b>{sample}</b></div>'
    
    await expect(transform(str)).resolves.toEqual('<div><b>{sample}</b></div>');
  });
});