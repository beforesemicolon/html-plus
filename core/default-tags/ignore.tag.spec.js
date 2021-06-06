const {transform} = require('./../transform');

describe('Ignore Tag', () => {
  it('should not bind data', async () => {
    const str = '<ignore><div><b>{sample}</b></div></ignore>'
    
    await expect(transform(str)).resolves.toEqual('<div><b>{sample}</b></div>');
  });
});