const {transform} = require('./../transform');

describe('Ignore Attribute', () => {
  it('should not bind data', () => {
    const str = '<div #ignore><b>{sample}</b></div>'
    
    expect(transform(str)).toEqual('<div><b>{sample}</b></div>');
  });
});