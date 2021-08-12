const {transform} = require('../../transform');

describe('Style Tag', () => {
  it('should render content as is', async () => {
    const str = '<style>body {font-size: 12px;}</style>'
    
    await expect(transform(str)).resolves.toEqual('<style>body {font-size: 12px;}</style>');
  });
});
