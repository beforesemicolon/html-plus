const {Attr} = require('./Attr');

describe('Attr', () => {
  const attr1 = new Attr('id', 'sample');
  const attr2 = new Attr('#if', 'x > 10');
  const attr3 = new Attr('download');
  
  it('should set', () => {
    expect(attr1.name).toEqual('id');
    expect(attr1.value).toEqual('sample');
    expect(attr2.name).toEqual('if');
    expect(attr2.value).toEqual('x > 10');
    expect(attr3.name).toEqual('download');
    expect(attr3.value).toEqual(null);
  });
  
  it('should return formatted string', () => {
    expect(attr1.toString()).toEqual('id="sample"');
    expect(attr2.toString()).toEqual('');
    expect(attr3.toString()).toEqual('download');
  });
});
