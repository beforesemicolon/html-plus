const {Attr} = require('./Attr');

describe('Attr', () => {
  const attr1 = new Attr('id', 'sample');
  const attr2 = new Attr('#if', 'x > 10');
  const attr3 = new Attr('download');
  const attr4 = new Attr('href', '');
  const attr5 = new Attr('two-part', '100');
  
  it('should set', () => {
    expect(attr1.name).toEqual('id');
    expect(attr1.value).toEqual('sample');
    expect(attr2.name).toEqual('#if');
    expect(attr2.value).toEqual('x > 10');
    expect(attr3.name).toEqual('download');
    expect(attr3.value).toEqual(null);
    expect(attr4.name).toEqual('href');
    expect(attr4.value).toEqual(null);
    expect(attr5.name).toEqual('two-part');
    expect(attr5.value).toEqual('100');
  });
  
  it('should return formatted string', () => {
    expect(attr1.toString()).toEqual('id="sample"');
    expect(attr2.toString()).toEqual('#if="x > 10"');
    expect(attr3.toString()).toEqual('download');
    expect(attr4.toString()).toEqual('href');
    expect(attr5.toString()).toEqual('two-part="100"');
  });
});
