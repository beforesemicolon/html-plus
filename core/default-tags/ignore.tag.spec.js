const {transform} = require('./../transform');

describe('Ignore Tag', () => {
  it('should not bind data', () => {
    const str = '<ignore><div><b>{sample}</b></div></ignore>'
    
    expect(transform(str)).toEqual('<div><b>{sample}</b></div>');
  });
});