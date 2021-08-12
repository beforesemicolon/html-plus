const {transform} = require('../../transform');

describe('Script Tag', () => {
  it('should render content as is', async () => {
    const str = '<script>console.log(12)</script>'
    
    await expect(transform(str)).resolves.toEqual('<script>console.log(12)</script>');
  });
});
